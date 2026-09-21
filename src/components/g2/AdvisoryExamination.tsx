import { useId, useState } from "react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import "./advisory-examination.css";

const PREMISES = [
  {
    name: "Geração",
    record: "Produção estimada",
    state: "Origem não apresentada",
    question: "De onde vem a energia prometida?",
    examine:
      "Irradiação, perdas e desempenho precisam de uma referência. A potência instalada, sozinha, não demonstra a geração.",
    consequence:
      "Sem a base da estimativa, a receita projetada permanece uma premissa.",
  },
  {
    name: "Tarifa",
    record: "Valor da energia",
    state: "Trajetória não informada",
    question: "Qual tarifa sustenta esse retorno?",
    examine:
      "Preço inicial, reajustes e regime de compensação alteram a leitura. Uma hipótese comercial não é uma medição futura.",
    consequence:
      "Sem a trajetória tarifária, o prazo não pode ser reproduzido.",
  },
  {
    name: "Custos",
    record: "Operação e manutenção",
    state: "Custos não discriminados",
    question: "O que ficou fora da conta?",
    examine:
      "Manutenção, seguros e reposições podem mudar o resultado. Ausência de um custo no documento não significa custo zero.",
    consequence:
      "Sem os custos ao longo do tempo, a conclusão permanece incompleta.",
  },
] as const;

/** Public, illustrative examination. No operator data, simulated calculation or customer claim. */
export function AdvisoryExamination({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const premise = PREMISES[selected];
  return (
    <article
      className={`g23-examination${compact ? " g23-examination--compact" : ""}`}
      aria-label="Exame interativo de uma afirmação ilustrativa"
    >
      <div className="g23-examination__claim">
        <div className="g23-examination__meta">
          <span className="g2-mono">SÓCRATES / QUESTIONAR</span>
          <span className="g2-mono">AMOSTRA ILUSTRATIVA</span>
        </div>
        <img
          className="g23-examination__patron"
          src="/g2/g21/emblems/socrates-hero-600.webp"
          alt=""
          aria-hidden="true"
          width={600}
          height={600}
        />
        <span className="g2-eyebrow">A afirmação</span>
        <blockquote>
          “A proposta se paga
          <br />
          em <strong>3,2</strong> anos.”
        </blockquote>
        <p>
          Uma promessa entra.
          <br />
          As premissas precisam aparecer.
        </p>
        <ArrowDownRight
          className="g23-examination__direction"
          size={30}
          aria-hidden="true"
        />
      </div>
      <div className="g23-examination__work">
        <div className="g23-examination__instruction">
          <span className="g2-mono">ABRA UMA PREMISSA</span>
          <span>01 — 03</span>
        </div>
        <div
          className="g23-examination__tabs"
          role="tablist"
          aria-label="Premissas da proposta"
        >
          {PREMISES.map((item, i) => (
            <button
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={selected === i}
              aria-controls={`${id}-panel`}
              tabIndex={selected === i ? 0 : -1}
              key={item.name}
              onClick={() => setSelected(i)}
              onKeyDown={(event) => {
                const next =
                  event.key === "ArrowRight"
                    ? (i + 1) % PREMISES.length
                    : event.key === "ArrowLeft"
                      ? (i + PREMISES.length - 1) % PREMISES.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? PREMISES.length - 1
                          : null;
                if (next === null) return;
                event.preventDefault();
                setSelected(next);
                document.getElementById(`${id}-tab-${next}`)?.focus();
              }}
            >
              <span className="g2-mono">0{i + 1}</span>
              {item.name}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
        <section
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${selected}`}
          className="g23-examination__panel"
          key={selected}
        >
          <div className="g23-examination__record">
            <span>{premise.record}</span>
            <span>{premise.state}</span>
          </div>
          <h3>{premise.question}</h3>
          <p>{premise.examine}</p>
          <div className="g23-examination__consequence">
            <span className="g2-mono">O QUE MUDA NA LEITURA</span>
            <p>{premise.consequence}</p>
          </div>
        </section>
        <div className="g23-examination__verdict">
          <span className="g2-mono">PARECER DESTA AMOSTRA</span>
          <strong>Evidência insuficiente para confirmar o retorno.</strong>
          <span>O limite acompanha a conclusão.</span>
        </div>
      </div>
    </article>
  );
}
