import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { contextEvidence, deployment, longiAnnouncement, milestones, readiness } from "./milestones.ts";
import type { EvidenceRef, Milestone, Observation } from "./model.ts";
import { solarPv, tandem, topcon } from "./model.ts";
import {
  compareMeasurements, evidenceFor, findEvidence, hasTopconRelationship, metricValue,
  readDeployment, readMilestone, readReadiness,
} from "./readModel.ts";
import { readEvidence } from "./sources.ts";

const deviceNames = {
  "research-cell": "Célula de pesquisa",
  "prototype-module": "Módulo protótipo",
  "mini-tandem": "Minimódulo experimental",
  "field-system": "Sistema em demonstração",
};
const authorityNames = {
  "external-lab": "Medição de laboratório externo publicada por terceiros",
  "research-team": "Medição publicada pela equipe de pesquisa",
  "project-announcement": "Divulgação da instituição participante",
  "host-and-issuer": "Confirmação do anfitrião e especificações da fabricante",
};
const comparisonNames = {
  COMPARABLE: "Comparável",
  COMPARABLE_WITH_QUALIFICATION: "Comparável com ressalvas",
  NOT_COMPARABLE: "Não comparável",
  UNRESOLVED: "Comparabilidade indeterminada",
};

function toView(view: string, fields: Record<string, string> = {}) {
  return { search: new URLSearchParams({ view, ...fields }).toString() };
}

function toMeasurement(id: string, version: string, via: string, ref?: EvidenceRef) {
  const fields: Record<string, string> = { id, version, via };
  if (ref) {
    fields.document = ref.documentId;
    fields.edition = ref.version;
  }
  return toView("measurement", fields);
}

function SourcePanel({ evidenceRef, allowed }: { evidenceRef: EvidenceRef | undefined; allowed: boolean }) {
  const document = allowed && evidenceRef && readEvidence(evidenceRef, "local", "summary-and-metadata");
  if (!document) return <p role="status">Evidência indisponível para esta referência ou formato.</p>;

  return (
    <section aria-labelledby="evidence-heading" id="evidence" tabIndex={-1}>
      <h2 id="evidence-heading">Evidência</h2>
      <p><cite>{document.title}</cite></p>
      <dl>
        <dt>Crédito</dt><dd>{document.creditedTo} · {document.sourceName}</dd>
        <dt>Publicação</dt><dd>{document.date} · {document.language === "ja" ? "Japonês" : "Inglês"}</dd>
        <dt>Versão e localizador</dt><dd>{document.version} · {document.locator}</dd>
        {document.nativeId && <><dt>Referência da fonte</dt><dd>{document.nativeId}</dd></>}
        <dt>Direitos</dt>
        <dd>
          {document.notice} Curadoria manual privada condicionada ao uso de síntese factual e metadados.
          Revisão em {document.reviewedOn} (NIV-74). Exibição externa, exportação, API, documentos integrais e reproduções indisponíveis.
        </dd>
      </dl>
      {document.url && <p><a href={document.url} target="_blank" rel="noreferrer">Consultar fonte original</a></p>}
    </section>
  );
}

function MilestoneList({ via }: { via: "tandem" | "topcon" }) {
  const records = via === "topcon" ? milestones.filter((item) => hasTopconRelationship(item.id)) : milestones;

  return (
    <ul className="frontier-list">
      {records.map((item) => {
        const observation = item.versions[0];
        return (
          <li key={item.id}>
            <h2><Link to={toMeasurement(item.id, observation.version, via)}>{item.title}</Link></h2>
            <p>{deviceNames[item.device.kind]} · {item.reachedBy}</p>
            <p><strong>{metricValue(observation.metrics[0])}</strong> · {observation.reporter}</p>
          </li>
        );
      })}
    </ul>
  );
}

function Maturity({ subject }: { subject: string }) {
  const technical = readReadiness(subject);
  const market = readDeployment(subject);

  return (
    <dl>
      <dt>Prontidão técnica</dt>
      <dd>{technical
        ? <>TRL {technical.level} · {technical.assessor}, {technical.publishedOn}. Avaliação restrita ao desenvolvimento da célula Fraunhofer ISE TOPCon de 30,6%.</>
        : "Sem avaliação de TRL para este dispositivo nas fontes selecionadas."}</dd>
      <dt>Mercado e implantação</dt>
      <dd>{market
        ? <>{market.stage} · {market.assessor}, {market.assessedOn}. Avaliação da instalação de Kaneka em Saitama com base no registro municipal.</>
        : "Estágio de mercado sem avaliação para este dispositivo nas fontes selecionadas."}</dd>
    </dl>
  );
}

function ComparisonControl({ milestone, observation }: { milestone: Milestone; observation: Observation }) {
  const [comparedId, setComparedId] = useState("");
  const compared = readMilestone(comparedId);
  const verdict = compared && compareMeasurements({ milestone, observation }, compared);
  return (
    <section>
      <h2>Comparabilidade</h2>
      <label>
        Aferir comparabilidade com outro marco
        <select value={comparedId} onChange={(event) => setComparedId(event.target.value)}>
          <option value="">Selecione um marco</option>
          {milestones.filter((item) => item.id !== milestone.id).map((item) => (
            <option value={item.id} key={item.id}>{item.title}</option>
          ))}
        </select>
      </label>
      {verdict && <p role="status"><strong>{comparisonNames[verdict.status]}</strong> · {verdict.reason}</p>}
    </section>
  );
}

function Measurement({ id, version, via, documentId, edition, allowed }: {
  id: string | null;
  version: string | null;
  via: "tandem" | "topcon";
  documentId: string | null;
  edition: string | null;
  allowed: boolean;
}) {
  const record = readMilestone(id, version);
  if (!record || (via === "topcon" && !hasTopconRelationship(record.milestone.id))) {
    return <><h1 tabIndex={-1}>Marco indisponível</h1><Link to={toView("milestones")}>Voltar aos marcos</Link></>;
  }
  const { milestone, observation } = record;
  const { device } = milestone;
  const { setup } = observation;
  const sourceRefs = evidenceFor(observation);
  const back = toView(via === "topcon" ? "topcon" : "milestones");

  if (documentId !== null || edition !== null || !allowed) {
    const ref = documentId === null || version === null ? undefined : findEvidence(observation, documentId, edition);
    return (
      <>
        <h1 tabIndex={-1}>{milestone.title}</h1>
        <p>{deviceNames[device.kind]} · <strong>{metricValue(observation.metrics[0])}</strong></p>
        <SourcePanel evidenceRef={ref} allowed={allowed} />
        <p><Link to={toMeasurement(milestone.id, observation.version, via)}>Voltar à medição</Link></p>
      </>
    );
  }

  return (
    <article data-observation={observation.id} data-version={observation.version}>
      <h1 tabIndex={-1}>{milestone.title}</h1>
      <p><Link to={back}>{via === "topcon" ? "Voltar ao vínculo TOPCon" : "Voltar aos marcos"}</Link></p>
      <p>{deviceNames[device.kind]} · {milestone.reachedBy}</p>
      <h2>Dispositivo e medição</h2>
      <dl>
        <dt>Dispositivo</dt><dd>{device.description}</dd>
        <dt>Terminais</dt><dd>{device.terminals === null ? "Configuração não informada" : `${device.terminals}T`}</dd>
        <dt>Célula inferior de silício</dt><dd>{device.silicon ?? "Arquitetura sem confirmação nesta evidência"}</dd>
        <dt>Área e definição</dt><dd>{observation.area?.description ?? "Área não estabelecida"}</dd>
        <dt>Condições</dt>
        <dd>
          {setup?.regime === "stc" && <>STC · {setup.spectrum} · {setup.irradiance.toLocaleString("pt-BR")} W/m² · referência a {setup.temperature} °C. </>}
          {setup?.details ?? "Protocolo completo sem confirmação nesta versão."}
        </dd>
        {observation.metrics.map((metric) => (
          <div key={metric.kind}>
            <dt>{metric.kind === "pce" ? "Eficiência de conversão (PCE)" : "Resultado"}</dt>
            <dd>
              <strong>{metricValue(metric)}</strong>. {metric.denominator}
              {metric.uncertainty === null && metric.kind !== "installed-module-count" && " Incerteza quantitativa sem confirmação."}
            </dd>
          </div>
        ))}
        <dt>Executor do ensaio</dt><dd>{observation.measurer ?? "Sem medição de desempenho neste registro."}</dd>
        <dt>Origem do resultado</dt><dd>{observation.reporter} · {authorityNames[observation.authority]}</dd>
        <dt>Observação</dt><dd>{observation.observedPeriod ?? "Data exata do ensaio sem confirmação."}</dd>
        <dt>Publicação</dt><dd>{observation.publishedOn}</dd>
        <dt>Registro na ARGOS</dt><dd>{observation.knownOn ?? "Data de primeiro conhecimento sem registro."}</dd>
        <dt>Alcance</dt><dd>{observation.limitations}</dd>
      </dl>
      <h2>Fontes e versões</h2>
      <ul>
        {sourceRefs.map((ref) => (
          <li key={ref.documentId}>
            <Link to={toMeasurement(milestone.id, observation.version, via, ref)}>{ref.locator}</Link>
          </li>
        ))}
      </ul>
      {milestone.versions.length > 1 && (
        <ul aria-label="Versões da observação">
          {milestone.versions.map((entry) => (
            <li key={entry.version}>
              {entry.version === observation.version
                ? <span aria-current="true">{entry.publishedOn} (em leitura)</span>
                : <Link to={toMeasurement(milestone.id, entry.version, via)}>{entry.publishedOn}</Link>}
            </li>
          ))}
        </ul>
      )}
      {sourceRefs.includes(longiAnnouncement.evidence) && (
        <section>
          <h2>Declaração posterior da fabricante</h2>
          <p>{longiAnnouncement.summary}</p>
        </section>
      )}
      <h2>Maturidade neste dispositivo</h2>
      <Maturity subject={device.id} />
      <ComparisonControl key={`${id}/${observation.version}`} milestone={milestone} observation={observation} />
      <h2>Próxima evidência</h2>
      <p>{milestone.nextEvidence}</p>
      <p><Link to={toView("tandem")}>Tecnologia relacionada · Tandem perovskita–silício</Link></p>
      {hasTopconRelationship(milestone.id) && <p><Link to={toView("topcon")}>TOPCon como célula inferior neste marco</Link></p>}
    </article>
  );
}

export function ResearchFrontier() {
  const [params] = useSearchParams();
  const main = useRef<HTMLElement>(null);
  const { key } = useLocation();
  useEffect(() => {
    const target = main.current?.querySelector<HTMLElement>("#evidence")
      ?? main.current?.querySelector<HTMLElement>("h1");
    window.scrollTo(0, 0);
    target?.focus();
  }, [key]);

  const view = params.get("view") ?? "technology";
  const via = params.get("via") === "topcon" ? "topcon" : "tandem";
  const allowed = !params.has("output") || params.get("output") === "summary-and-metadata";
  const contextRequested = params.has("document") || params.has("edition") || !allowed;

  return (
    <main ref={main} className="frontier">
      <header>
        <p>ARGOS · Fronteira de pesquisa · Protótipo local privado</p>
        <nav aria-label="Tecnologia">
          <Link to={toView("technology")}>Solar PV</Link>
          <Link to={toView("tandem")}>Tandem perovskita–silício</Link>
          <Link to={toView("milestones")}>Marcos de pesquisa</Link>
        </nav>
      </header>
      {view === "technology" && (
        <section data-object={solarPv}>
          <h1 tabIndex={-1}>Solar PV</h1>
          <p>Sistemas fotovoltaicos convertem luz em eletricidade. A arquitetura tandem reúne junções que absorvem faixas diferentes do espectro solar.</p>
          <p><Link to={toView("tandem")}>Explorar variante tandem perovskita–silício</Link></p>
        </section>
      )}
      {view === "tandem" && (
        <section data-object={tandem}>
          <h1 tabIndex={-1}>Tandem perovskita–silício</h1>
          <p>A perovskita superior absorve fótons de maior energia. Parte da luz transmitida chega à célula inferior de silício cristalino.</p>
          <p>Uma célula monolítica de dois terminais (2T) liga as junções em série. No empilhamento de quatro terminais (4T), os dois circuitos podem operar em seus próprios pontos de máxima potência.</p>
          {contextRequested
            ? <>
              <SourcePanel allowed={allowed} evidenceRef={
                params.get("document") === contextEvidence.documentId && params.get("edition") === contextEvidence.version
                  ? contextEvidence : undefined
              } />
              <Link to={toView("tandem")}>Voltar à variante</Link>
            </>
            : <p><Link to={toView("tandem", { document: contextEvidence.documentId, edition: contextEvidence.version })}>Fonte dos fundamentos</Link></p>}
          <h2>Marcos e maturidade</h2>
          <p><Link to={toView("milestones")}>Investigar os cinco marcos de pesquisa</Link></p>
          <ul>
            <li><Link to={toMeasurement(readiness.milestone, milestones[2].versions[0].version, "tandem", readiness.evidence)}>
              Prontidão técnica · TRL 6 (IEA) para a célula Fraunhofer ISE TOPCon de 30,6%
            </Link></li>
            <li><Link to={toMeasurement(deployment.milestone, milestones[4].versions[0].version, "tandem", deployment.evidence)}>
              Implantação · demonstração Kaneka–Saitama (NIVAR)
            </Link></li>
          </ul>
          <p><Link to={toView("topcon")}>Marcos com célula inferior TOPCon</Link></p>
          <h2>Barreiras e próximos ensaios</h2>
          <p>Estabilidade das camadas, vedação e rendimento de fabricação precisam de séries de campo e ensaios de lotes identificados. Custos observados e economia em operação permanecem em aberto para os dispositivos deste recorte.</p>
        </section>
      )}
      {view === "milestones" && <><h1 tabIndex={-1}>Marcos de pesquisa</h1><MilestoneList via="tandem" /></>}
      {view === "topcon" && (
        <section data-object={topcon}>
          <h1 tabIndex={-1}>TOPCon como célula inferior</h1>
          <p>Os estudos de Nicósia e Fraunhofer ISE identificam contatos passivados por óxido de tunelamento no silício das amostras abaixo.</p>
          <MilestoneList via="topcon" />
          <Link to={toView("tandem")}>Voltar à variante tandem</Link>
        </section>
      )}
      {view === "measurement" && (
        <Measurement id={params.get("id")} version={params.get("version")} via={via}
          documentId={params.get("document")} edition={params.get("edition")} allowed={allowed} />
      )}
      {!["technology", "tandem", "milestones", "topcon", "measurement"].includes(view)
        && <><h1 tabIndex={-1}>Vista indisponível</h1><Link to={toView("technology")}>Voltar à tecnologia</Link></>}
    </main>
  );
}
