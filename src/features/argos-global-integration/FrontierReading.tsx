import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { contextEvidence, longiAnnouncement } from "../argos-research-frontier/milestones";
import type { Milestone, Observation } from "../argos-research-frontier/model";
import {
  compareMeasurements, evidenceFor, findEvidence, hasTopconRelationship, metricValue,
  readDeployment, readMilestone, readReadiness,
} from "../argos-research-frontier/readModel";
import { readEvidence } from "../argos-research-frontier/sources";
import { entryFor, milestoneEntries, sharedRefs, tandemKey } from "./catalog";
import { Evidence } from "./Evidence";
import { ExploreLink } from "./navigation";
import { explorePath, objectPath, readDisclosure, readPair } from "./paths";

const deviceLabels = {
  "research-cell": "Célula de pesquisa",
  "prototype-module": "Módulo protótipo",
  "mini-tandem": "Minimódulo experimental",
  "field-system": "Sistema em demonstração",
};
const authorityLabels = {
  "external-lab": "Medição de laboratório externo publicada por terceiros",
  "research-team": "Medição publicada pela equipe de pesquisa",
  "project-announcement": "Divulgação da instituição participante",
  "host-and-issuer": "Confirmação do anfitrião e especificações da fabricante",
};

function Compare({ milestone, observation }: { milestone: Milestone; observation: Observation }) {
  const [selection, setSelection] = useState("");
  const comparison = readMilestone(selection);
  const verdict = comparison && compareMeasurements({ milestone, observation }, comparison);
  return (
    <section className="ax-section ax-comparison">
      <h2>Comparabilidade</h2>
      <label htmlFor="ax-compare">Aferir comparabilidade com outro marco</label>
      <select id="ax-compare" value={selection} onChange={(event) => setSelection(event.target.value)}>
        <option value="">Selecione um marco</option>
        {milestoneEntries.filter((entry) => entry.id !== milestone.id).map((entry) => (
          <option key={entry.id} value={entry.id}>{entry.name}</option>
        ))}
      </select>
      {verdict && <p role="status"><strong>{verdict.status}</strong> · {verdict.reason}</p>}
    </section>
  );
}

function Measurement({ milestone, observation, query }: { milestone: Milestone; observation: Observation; query: string }) {
  const { device } = milestone;
  const { setup } = observation;
  const technical = readReadiness(device.id);
  const deployment = readDeployment(device.id);
  const key = entryFor(milestone.id)?.key;
  return (
    <article data-observation={observation.id} data-version={observation.version}>
      <section className="ax-section">
        <h2>Dispositivo e medição</h2>
        <p>{deviceLabels[device.kind]} · {milestone.reachedBy}. {device.description}</p>
        <dl className="ax-fields">
          <div><dt>Terminais e célula inferior</dt><dd>{device.terminals ? `${device.terminals}T` : "Configuração não informada"} · {device.silicon ?? "Arquitetura sem confirmação"}</dd></div>
          <div><dt>Área e definição</dt><dd>{observation.area?.description ?? "Área não estabelecida"}</dd></div>
          <div><dt>Condições</dt><dd>
            {setup?.regime === "stc" && <>STC · {setup.spectrum} · {setup.irradiance.toLocaleString("pt-BR")} W/m² · {setup.temperature} °C. </>}
            {setup?.details ?? "Protocolo completo sem confirmação nesta versão."}
          </dd></div>
          {observation.metrics.map((metric) => (
            <div key={metric.kind}><dt>{metric.kind === "pce" ? "Eficiência de conversão (PCE)" : "Resultado"}</dt>
              <dd><strong>{metricValue(metric)}</strong> · {metric.denominator}
                {metric.uncertainty === null && metric.kind !== "installed-module-count" && " Incerteza quantitativa sem confirmação."}
              </dd></div>
          ))}
          <div><dt>Executor do ensaio</dt><dd>{observation.measurer ?? "Sem medição de desempenho no registro."}</dd></div>
          <div><dt>Origem do resultado</dt><dd>{observation.reporter} · {authorityLabels[observation.authority]}</dd></div>
          <div><dt>Observação</dt><dd>{observation.observedPeriod ?? "Data exata do ensaio sem confirmação."}</dd></div>
          <div><dt>Publicação e versão da observação</dt><dd>{observation.publishedOn} · {observation.version}</dd></div>
          <div><dt>Registro na ARGOS</dt><dd>{observation.knownOn ?? "Data de primeiro conhecimento sem registro."}</dd></div>
          <div><dt>Alcance</dt><dd>{observation.limitations}</dd></div>
        </dl>
        {milestone.versions.length > 1 && <ul className="ax-rail-list" aria-label="Versões da observação">
          {milestone.versions.map((version) => (
            <li key={version.version}>{version === observation
              ? <span aria-current="true">{version.publishedOn} (em leitura)</span>
              : <ExploreLink to={explorePath(query, key, {
                observation_ref: version.id, observation_version: version.version,
              })}>{version.publishedOn}</ExploreLink>}</li>
          ))}
        </ul>}
      </section>
      {evidenceFor(observation).includes(longiAnnouncement.evidence) && <section className="ax-section">
        <h2>Declaração posterior da fabricante</h2>
        <p>{longiAnnouncement.summary}</p>
      </section>}
      <section className="ax-section">
        <h2>Maturidade neste dispositivo</h2>
        <dl className="ax-fields">
          <div><dt>Prontidão técnica</dt><dd>{technical
            ? `TRL ${technical.level} · ${technical.assessor}, ${technical.publishedOn}. Avaliação restrita à célula Fraunhofer ISE TOPCon de 30,6%.`
            : "Sem avaliação de TRL para este dispositivo nas fontes selecionadas."}</dd></div>
          <div><dt>Mercado e implantação</dt><dd>{deployment
            ? `${deployment.stage} · ${deployment.assessor}, ${deployment.assessedOn}.`
            : "Estágio de mercado sem avaliação para este dispositivo nas fontes selecionadas."}</dd></div>
        </dl>
        <p>{milestone.nextEvidence}</p>
        {hasTopconRelationship(milestone.id) && <ExploreLink className="ax-text-link" to={objectPath(query, sharedRefs.topcon)}>
          TOPCon como célula inferior neste marco
        </ExploreLink>}
      </section>
      <Compare key={observation.version} milestone={milestone} observation={observation} />
    </article>
  );
}

export function FrontierReading({ entry }: { entry: NonNullable<ReturnType<typeof entryFor>> }) {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const technology = entry.key === tandemKey;
  const pin = readPair(params, "observation");
  const docPin = readPair(params, "document");
  const disclosure = readDisclosure(params);
  const reading = !technology && pin !== false ? readMilestone(entry.id, pin?.version) : undefined;
  const compatible = technology ? pin === null : reading && (!pin || reading.observation.id === pin.ref);
  const evidence = reading ? evidenceFor(reading.observation) : [contextEvidence];
  const selectedRef = docPin && (reading
    ? findEvidence(reading.observation, docPin.ref, docPin.version)
    : evidence.find((ref) => ref.documentId === docPin.ref && ref.version === docPin.version));
  const selected = selectedRef && readEvidence(selectedRef, "local", "summary-and-metadata");
  if (!compatible || docPin === false || disclosure === "invalid" ||
    (disclosure === "open" && (!selected || (!technology && pin === null))) ||
    (disclosure === "closed" && docPin !== null)) {
    return <p className="ax-notice" role="status">Evidência ou marco indisponível para esta referência ou versão.</p>;
  }

  const obs = reading ? {
    observation_ref: reading.observation.id,
    observation_version: reading.observation.version,
  } : undefined;
  return (
    <div className="ax-layout">
      <div className="ax-reading">
        {reading ? <Measurement {...reading} query={query} /> : <>
          <section className="ax-section">
            <h2>Como as junções se complementam</h2>
            <p>A perovskita superior absorve fótons de maior energia. Parte da luz transmitida chega à célula inferior de silício cristalino.</p>
            <p>Uma célula monolítica de dois terminais (2T) liga as junções em série. No empilhamento de quatro terminais (4T), os circuitos podem operar em pontos de máxima potência próprios.</p>
            <ExploreLink className="ax-text-link" to={objectPath(query, sharedRefs.solarPv)}>Tecnologia-mãe · Solar PV</ExploreLink>
          </section>
          <section className="ax-section">
            <h2>Marcos de pesquisa</h2>
            <ul className="ax-rail-list">
              {milestoneEntries.map((item) => (
                <li key={item.id}><ExploreLink to={objectPath(query, item.id)}>{item.name}</ExploreLink></li>
              ))}
            </ul>
          </section>
        </>}
      </div>
      <Evidence
        links={evidence.map((ref) => ({
          title: ref.locator,
          to: explorePath(query, entry.key, {
            ...obs, evidence: "document", document_ref: ref.documentId, document_version: ref.version,
          }),
        }))}
        closeTo={explorePath(query, entry.key, obs)}
      >
        {disclosure === "open" && selectedRef && selected && <div data-document={selectedRef.documentId} data-version={selected.version}>
          <h3>{selected.title}</h3>
          <dl className="ax-fields">
            <div><dt>Crédito</dt><dd>{selected.creditedTo} · {selected.sourceName}</dd></div>
            <div><dt>Publicação e idioma</dt><dd>{selected.date} · {selected.language === "ja" ? "Japonês" : "Inglês"}</dd></div>
            <div><dt>Versão e localizador</dt><dd>{selected.version} · {selected.locator}</dd></div>
            <div><dt>Direitos</dt><dd>{selected.notice} Revisão em {selected.reviewedOn} (NIV-74). Síntese factual e metadados para curadoria privada.</dd></div>
          </dl>
          {selected.url && <a className="ax-text-link" href={selected.url} target="_blank" rel="noreferrer">Consultar fonte original</a>}
        </div>}
      </Evidence>
    </div>
  );
}
