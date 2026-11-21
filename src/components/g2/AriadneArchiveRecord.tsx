import { ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import "./ariadne-archive-record.css";

export type ArchiveFocus = "v1" | "v2" | "scenario-a" | "scenario-b" | "result-a" | "result-b" | "compare";

type ArchiveSelect = (focus: ArchiveFocus) => void;

const RECORDS = {
  v1: {
    units: [{ id: "UC01", name: "Produção" }, { id: "UC02", name: "Escritório" }],
    contracts: [{ id: "CT01", covers: "UC01 · UC02" }],
    scenario: "scenario-a" as const,
  },
  v2: {
    units: [{ id: "UC01", name: "Produção" }, { id: "UC02", name: "Escritório" }, { id: "UC03", name: "Armazém" }],
    contracts: [{ id: "CT01", covers: "UC01 · UC02" }, { id: "CT02", covers: "UC03" }],
    scenario: "scenario-b" as const,
  },
};

function StructuralCounts({ current }: { current: boolean }) {
  return <dl className="ar-record__counts"><div><dt>Unidades</dt><dd>{current ? "03" : "02"}</dd></div><div><dt>Contratos</dt><dd>{current ? "02" : "01"}</dd></div></dl>;
}

function StateRecord({ current, onSelect }: { current: boolean; onSelect: ArchiveSelect }) {
  const version = current ? "v2" : "v1";
  const record = RECORDS[version];
  return <>
    <header className="ar-record__heading"><span className="ar-record__eyebrow">{current ? "ATUAL · SUCEDE V1" : "HISTÓRICO PRESERVADO"}</span><h3>Estado {version}.</h3></header>
    <p className="ar-record__note">{current ? "V2 acrescenta UC03 e CT02. V1 permanece intacto." : "UC01 e UC02 sob CT01. O cenário A conserva esta origem."}</p>
    <StructuralCounts current={current} />
    <details className="ar-record__details">
      <summary>Abrir inventário privado <ChevronDown size={14} aria-hidden="true" /></summary>
      <div className="ar-record__details-body ar-record__details-body--inventory">
        <div><span className="ar-record__label">UNIDADES</span>
        <ul className="ar-record__inventory">{record.units.map((unit) => <li key={unit.id}><span>{unit.id}</span><strong>{unit.name}</strong></li>)}</ul></div>
        <div><span className="ar-record__label">CONTRATOS</span>
        <ul className="ar-record__inventory">{record.contracts.map((contract) => <li key={contract.id}><span>{contract.id}</span><strong>{contract.covers}</strong></li>)}</ul></div>
      </div>
    </details>
    <nav className="ar-record__actions" aria-label={`Explorar o estado ${version}`}>
      <button type="button" onClick={() => onSelect(record.scenario)}>Abrir cenário {current ? "B" : "A"} <ArrowUpRight size={14} aria-hidden="true" /></button>
      <button type="button" onClick={() => onSelect("compare")}>Comparar v1 e v2 <ArrowLeftRight size={14} aria-hidden="true" /></button>
    </nav>
  </>;
}

function ScenarioRecord({ current, onSelect }: { current: boolean; onSelect: ArchiveSelect }) {
  const letter = current ? "B" : "A";
  const origin = current ? "v2" : "v1";
  return <>
    <header className="ar-record__heading"><span className="ar-record__eyebrow">PREMISSAS {letter} / HIPÓTESE PRIVADA</span><h3>Cenário {letter}.</h3></header>
    <p className="ar-record__note">{current ? "Segundo turno em UC03: hipótese de B, sem alterar o estado v2." : "Manter a configuração de v1 por 12 meses, mesmo após a criação de v2."}</p>
    <dl className="ar-record__facts"><div><dt>Origem</dt><dd>Estado {origin}</dd></div><div><dt>Horizonte</dt><dd>12 meses</dd></div></dl>
    <details className="ar-record__details">
      <summary>Abrir premissas {letter} <ChevronDown size={14} aria-hidden="true" /></summary>
      <div className="ar-record__details-body">
        <p>{current ? "Configuração de v2: UC01, UC02 e UC03; CT01 e CT02. A hipótese acrescenta um segundo turno em UC03." : "Configuração de v1: UC01 e UC02; CT01. A hipótese conserva essa configuração durante o horizonte de 12 meses."}</p>
        <p className="ar-record__boundary">Premissa do cenário; não é fato incorporado ao estado.</p>
      </div>
    </details>
    <nav className="ar-record__actions" aria-label={`Explorar o cenário ${letter}`}>
      <button type="button" onClick={() => onSelect(current ? "result-b" : "result-a")}>Abrir resultado {letter} <ArrowUpRight size={14} aria-hidden="true" /></button>
      <button type="button" onClick={() => onSelect(origin)}>Retomar estado {origin} <ArrowLeft size={14} aria-hidden="true" /></button>
    </nav>
  </>;
}

function ResultRecord({ current, onSelect }: { current: boolean; onSelect: ArchiveSelect }) {
  const letter = current ? "B" : "A";
  const origin = current ? "v2" : "v1";
  return <>
    <header className="ar-record__heading"><span className="ar-record__eyebrow">REGISTRO ILUSTRATIVO</span><h3>Resultado {letter}.</h3></header>
    <p className="ar-record__note">Contagens estruturais predefinidas. Não são cálculo, previsão ou recomendação.</p>
    <StructuralCounts current={current} />
    <div className="ar-record__lineage">
      <span className="ar-record__label">CONTEXTO PRESERVADO</span>
      <nav aria-label={`Origem do resultado ${letter}`}><button type="button" onClick={() => onSelect(origin)}>Estado {origin}</button><ArrowRight size={14} aria-hidden="true" /><button type="button" onClick={() => onSelect(current ? "scenario-b" : "scenario-a")}>Cenário {letter}</button></nav>
    </div>
    <details className="ar-record__details">
      <summary>Modelo v1 · execução {letter} <ChevronDown size={14} aria-hidden="true" /></summary>
      <div className="ar-record__details-body">
        <dl className="ar-record__facts"><div><dt>Modelo</dt><dd>v1</dd></div><div><dt>Execução</dt><dd>{letter} · ilustrativa</dd></div><div><dt>Premissas</dt><dd>{letter} · cenário {letter}</dd></div><div><dt>Estado</dt><dd>{origin} · origem preservada</dd></div></dl>
        <p className="ar-record__boundary">Registro de demonstração. Nenhum modelo é executado nesta cena.</p>
      </div>
    </details>
    <nav className="ar-record__actions" aria-label={`Retomar o contexto do resultado ${letter}`}>
      <button type="button" onClick={() => onSelect(origin)}>Voltar à origem em {origin} <ArrowLeft size={14} aria-hidden="true" /></button>
    </nav>
  </>;
}

function CompareRecord({ onSelect }: { onSelect: ArchiveSelect }) {
  return <>
    <header className="ar-record__heading"><span className="ar-record__eyebrow">V1 → V2 / CONTINUIDADE</span><h3>O que muda.<br />O que permanece.</h3></header>
    <p className="ar-record__note">A mesma organização, em dois momentos. V1 e a origem do cenário A permanecem.</p>
    <table className="ar-record__comparison"><caption>Comparação dos estados privados sintéticos</caption><thead><tr><th scope="col">Registro</th><th scope="col">v1</th><th scope="col">v2</th></tr></thead><tbody><tr><th scope="row">Unidades</th><td>02</td><td>03</td></tr><tr><th scope="row">Contratos</th><td>01</td><td>02</td></tr><tr><th scope="row">Cenário vinculado</th><td>A</td><td>B</td></tr></tbody></table>
    <p className="ar-record__change"><strong>Em v2</strong>UC03 · Armazém<br />CT02 · cobre UC03</p>
    <p className="ar-record__boundary">ORG-DEMO-01 permanece. V2 sucede v1; o cenário B referencia v2, e o cenário A conserva v1.</p>
    <nav className="ar-record__actions ar-record__actions--pair" aria-label="Abrir cada versão do estado">
      <button type="button" onClick={() => onSelect("v1")}>Abrir v1 <ArrowUpRight size={14} aria-hidden="true" /></button><button type="button" onClick={() => onSelect("v2")}>Abrir v2 <ArrowUpRight size={14} aria-hidden="true" /></button>
    </nav>
  </>;
}

/** Local, predefined records for the Founder prototype. No model or data access. */
export function AriadneArchiveRecord({ focus, onSelect }: { focus: ArchiveFocus; onSelect: ArchiveSelect }) {
  return <article className="ar-record" key={focus} aria-label="Registro privado sintético de Ariadne">
    <p className="ar-record__identity">ORG-DEMO-01 <span>EXEMPLO PRIVADO SINTÉTICO</span></p>
    {(focus === "v1" || focus === "v2") && <StateRecord current={focus === "v2"} onSelect={onSelect} />}
    {(focus === "scenario-a" || focus === "scenario-b") && <ScenarioRecord current={focus === "scenario-b"} onSelect={onSelect} />}
    {(focus === "result-a" || focus === "result-b") && <ResultRecord current={focus === "result-b"} onSelect={onSelect} />}
    {focus === "compare" && <CompareRecord onSelect={onSelect} />}
  </article>;
}
