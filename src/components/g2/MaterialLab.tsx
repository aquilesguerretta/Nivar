import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import "./MaterialLab.css";

const OBSERVATIONS: readonly (number | null)[] = [68, 64, null, 81, null, 108];
const sampleLabel = (index: number) => String(index + 1).padStart(2, "0");

/** Local visual fixture. No value in this lab comes from a market feed. */
export function MaterialLab() {
  const [selected, setSelected] = useState(3);
  const value = OBSERVATIONS[selected];
  const missing = value === null;
  const state = missing ? "Sem observação" : "Observação selecionada";
  const figure = value === null ? "—" : String(value);
  const chartX = (index: number) => 30 + index * 44;
  const chartY = (observation: number) => 137 - observation * 0.85;

  return (
    <section className="g21-lab g2-container" aria-labelledby="material-lab-title">
      <div className="g21-lab-heading">
        <div>
          <span className="g21-lab-label">01 / Laboratório de materiais</span>
          <h2 id="material-lab-title">A mesma leitura.<br />Três superfícies.</h2>
        </div>
        <p>Selecione uma amostra para comparar papel, vidro e instrumento. Os números são ilustrativos; as lacunas permanecem visíveis.</p>
      </div>

      <fieldset className="g21-lab-selector">
        <legend>Selecionar amostra · série sintética em MW</legend>
        <div className="g21-lab-observations">
          {OBSERVATIONS.map((observation, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={selected === index}
              aria-label={`Amostra ${sampleLabel(index)}, ${observation === null ? "sem observação" : `${observation} MW`}`}
              data-lab-observation={index}
              className={observation === null ? "is-missing" : undefined}
              onClick={() => setSelected(index)}
            >
              <span>{sampleLabel(index)}</span>
              <strong>{observation ?? "—"}</strong>
              <small>{observation === null ? "ausente" : "MW"}</small>
            </button>
          ))}
        </div>
      </fieldset>
      <div className="g21-lab-state" aria-live="polite" aria-atomic="true">
        <span className={missing ? "g21-lab-state-mark is-missing" : "g21-lab-state-mark"} />
        <span>Amostra {sampleLabel(selected)} · {state}{missing ? ". A ausência não será convertida em zero." : `: ${figure} MW.`}</span>
        <span className="g21-lab-keyboard-note">Tab para inspecionar o foco</span>
      </div>

      <div className="g21-lab-materials" data-lab-state={missing ? "missing" : "observed"}>
        <article className="g21-lab-material g21-lab-paper">
          <div className="g21-lab-material-title"><span>01 / Mineral</span><span>Leitura</span></div>
          <div className="g21-lab-paper-sheet">
            <span className="g21-lab-label">Caderno de observação</span>
            <h3>Um número precisa de companhia.</h3>
            <div className="g21-lab-paper-value"><strong>{figure}</strong><span>MW</span></div>
            <dl>
              <div><dt>Amostra</dt><dd>{sampleLabel(selected)} de 06</dd></div>
              <div><dt>Natureza</dt><dd>{missing ? "Ausente" : "Ilustrativa"}</dd></div>
              <div><dt>Origem</dt><dd>Série sintética · G2.1</dd></div>
            </dl>
            <p>{missing ? "Nenhum valor foi atribuído a este intervalo." : "A unidade e a origem acompanham a leitura."}</p>
          </div>
          <footer>Fibra mineral · tinta · margem</footer>
        </article>

        <article className="g21-lab-material g21-lab-glass">
          <img className="g21-lab-transmission" src="/g2/g21/transmission-territory.webp" alt="Estudo visual de linhas de transmissão em território montanhoso" loading="lazy" />
          <div className="g21-lab-glass-shade" />
          <div className="g21-lab-material-title"><span>02 / Vidro</span><span>Contexto</span></div>
          <div className="g21-lab-glass-pane">
            <div className="g21-lab-glass-eyebrow"><span>Amostra {sampleLabel(selected)}</span><ArrowUpRight size={17} aria-hidden="true" /></div>
            <div className="g21-lab-glass-value"><strong>{figure}</strong><span>MW</span></div>
            <div className="g21-lab-glass-status">{state}</div>
            <p>{missing ? "O território continua visível. O dado permanece ausente." : "A leitura emerge sem apagar o território."}</p>
            <span className="g21-lab-glass-source">SÉRIE SINTÉTICA / ILUSTRATIVA</span>
          </div>
          <footer>Imagem editorial gerada · sem função documental</footer>
        </article>

        <article className="g21-lab-material g21-lab-dark">
          <div className="g21-lab-material-title"><span>03 / Instrumento</span><span>01 · Base</span></div>
          <div className="g21-lab-instrument">
            <div className="g21-lab-instrument-title"><span>Sequência ilustrativa</span><span>02 · Painel</span></div>
            <svg className="g21-lab-chart" viewBox="0 0 280 158" role="img" aria-label={`Série ilustrativa em MW: 68, 64, ausente, 81, ausente, 108. Amostra ${sampleLabel(selected)} selecionada.`}>
              {[40, 88, 137].map(y => <line key={y} x1="15" x2="265" y1={y} y2={y} className="g21-lab-gridline" />)}
              {OBSERVATIONS.slice(0, -1).map((observation, index) => {
                const next = OBSERVATIONS[index + 1];
                return observation !== null && next !== null
                  ? <line key={index} x1={chartX(index)} y1={chartY(observation)} x2={chartX(index + 1)} y2={chartY(next)} className="g21-lab-series" />
                  : null;
              })}
              <line x1={chartX(selected)} x2={chartX(selected)} y1="16" y2="141" className={missing ? "g21-lab-selection is-missing" : "g21-lab-selection"} />
              {OBSERVATIONS.map((observation, index) => observation === null
                ? <g key={index} className="g21-lab-gap"><path d={`M${chartX(index) - 5} 91l4-6 4 6 4-6`} /><text x={chartX(index)} y="153" textAnchor="middle">{sampleLabel(index)}</text></g>
                : <g key={index}><circle cx={chartX(index)} cy={chartY(observation)} r={selected === index ? 5 : 3} className={selected === index ? "g21-lab-point is-selected" : "g21-lab-point"} /><text x={chartX(index)} y="153" textAnchor="middle" className="g21-lab-chart-label">{sampleLabel(index)}</text></g>)}
            </svg>
            <div className="g21-lab-reading">
              <span className="g21-lab-reading-label">{missing ? "Lacuna preservada" : "Leitura selecionada"}<small>03 · Leitura</small></span>
              <div><strong>{figure}</strong><span>MW</span></div>
              <p>{missing ? "Sem interpolação. Sem zero artificial." : `Amostra ${sampleLabel(selected)} / série sintética`}</p>
            </div>
          </div>
          <footer>Base · painel · leitura em primeiro plano</footer>
        </article>
      </div>

      <div className="g21-lab-bottom">
        <div className="g21-lab-action-state">
          <span className="g21-lab-label">Foco e seleção</span>
          <button type="button" onClick={() => setSelected(missing ? 3 : 2)} data-lab-toggle="state">
            {missing ? "Ver observação · 81 MW" : "Ver ausência · amostra 03"}<ArrowRight size={17} aria-hidden="true" />
          </button>
          <p>A cor marca a seleção. O texto informa a condição.</p>
        </div>
        <details className="g21-lab-provenance">
          <summary>Origem e limites desta sequência <span>+</span></summary>
          <div>
            <p>68, 64, —, 81, —, 108 MW. Série sintética usada exclusivamente para comparar estados e materiais. Não descreve uma instalação, uma região ou um período real.</p>
            <p>As amostras 03 e 05 não têm observação. O traçado não conecta os intervalos ausentes. A imagem ao fundo é uma ilustração editorial gerada.</p>
          </div>
        </details>
      </div>
    </section>
  );
}
