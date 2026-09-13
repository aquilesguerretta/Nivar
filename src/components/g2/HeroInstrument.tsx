import { AnalysisInstrument } from "../../pages/terminal-brasil/AnalysisInstrument";
import { makeAnalysis } from "../../pages/terminal-brasil/analysis";
import { getSeries } from "../../pages/terminal-brasil/sample";
import { useNavigate } from "react-router-dom";

const models = makeAnalysis(["sudesteCentroOeste"], "24h", "load", 0, 23, "native");
const selected = getSeries("sudesteCentroOeste", "24h", "load")[18];

/** Directed read-only instance of the real Terminal instrument. Its model, scales,
 * selected observation, straight segments and source grammar are not recreated. */
export default function HeroInstrument() {
  const navigate = useNavigate();
  const inspect = (index: number) => navigate(`/br/terminal?region=sudesteCentroOeste&period=24h&metric=load&observation=${index}`);
  return <div className="g231-instrument-chart" aria-label="Carga sintética SE/CO em 24 horas; 68,1 GW às 18h">
    <AnalysisInstrument models={models} allModels={models} metric="load" scale="native" view="chart"
      selected={selected} id="g231-hero" inspect={inspect} selectRegion={() => inspect(18)} onSource={() => inspect(18)} />
  </div>;
}
