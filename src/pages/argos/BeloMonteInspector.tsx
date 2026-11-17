import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Wordmark } from "../../components/g2/Brand";
import { useNivarTheme } from "../../components/g2/nivar-theme";
import "../../components/g2/g21-fonts.css";
import "../terminal-brasil/terminal-brasil.css";
import "./belo-monte-inspector.css";

interface Version {
  id: string;
  retrievedAt: string;
  publishedAt: string | null;
  referenceTimeStart: string | null;
  referenceTimeEnd: string | null;
  sha256: string;
  byteSize: number;
  parserVersion: string;
  rightsRecordRef: string;
}

interface Unit {
  id: string;
  equipmentCode: string;
  unitNumber: string;
  identityState: "VERIFIED" | "UNKNOWN" | "UNRESOLVED";
  operationEntryDate: string | null;
  observation: {
    id: string;
    unit: "MW";
    value: string;
    comparison: { fromObservationId: string; fromMW: string; changeMW: string } | null;
  } | null;
}

interface Site {
  id: string;
  name: string;
  sourceLabel: string;
  evidenceIds: string[];
  units: Unit[];
}

interface ReadModel {
  state: "VERIFIED" | "UNRESOLVED";
  asset: { id: string; name: string; ceg: string; region: string; technology: string; evidenceId: string };
  concession: {
    company: { name: string; cnpj: string };
    instrument: string;
    effectiveFrom: string;
    evidenceId: string;
  };
  sites: Site[];
  totalMW: string | null;
  unreviewedUnitCount: number;
  source: { label: string; url: string; dictionaryUrl: string };
  version: Version;
  availableVersions: Pick<Version, "id" | "retrievedAt">[];
  comparison: { fromVersion: Version; rawBytesChanged: boolean; parsedContentChanged: boolean } | null;
  documents: { id: string; label: string; date: string; url: string }[];
}

type InspectionResult =
  | { key: string; data: ReadModel }
  | { key: string; error: string };

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});
const number = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});
const mw = (value: string) => number.format(Number(value)) + " MW";
const date = (value: string) => dateTime.format(new Date(value)) + " UTC";
const endpoints = {
  map: "/br/mapa-corporativo",
  terminal: "/br/terminal/ativos",
};
const titles = { map: "Brazil Corporate Energy Map", terminal: "Terminal Brasil" };

function normalized(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

function SourceLink({ url, children }: { url: string; children: React.ReactNode }) {
  return <a className="bm-source-link" href={url} target="_blank" rel="noreferrer">{children} ↗</a>;
}

export function BeloMonteInspector({ view }: { view: keyof typeof endpoints }) {
  const [params, setParams] = useSearchParams();
  const knownAt = params.get("known_at") ?? "";
  const key = view + "/" + knownAt;
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [query, setQuery] = useState("");
  const houseDark = useNivarTheme();
  const [tone, setTone] = useState<"graphite" | "paper">();
  const dark = tone ? tone === "graphite" : houseDark;

  useEffect(() => {
    const controller = new AbortController();
    const queryString = knownAt ? "?" + new URLSearchParams({ known_at: knownAt }) : "";
    void (async () => {
      try {
        const response = await fetch("/api/operator/argos/belo-monte" + queryString, {
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.status === 401 || response.status === 403) {
          throw new Error("Entre com uma conta autorizada para consultar esta evidência.");
        }
        if (response.status === 400) throw new Error("Data de consulta inválida.");
        if (!response.ok) throw new Error("Evidência indisponível para inspeção.");
        const payload: ReadModel | { state: "UNKNOWN" } = await response.json();
        if (payload.state === "UNKNOWN") {
          throw new Error("O ARGOS ainda não tinha evidência para essa data.");
        }
        if (!controller.signal.aborted) setResult({ key, data: payload });
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult({ key, error: error instanceof Error ? error.message : "Falha ao consultar a evidência." });
        }
      }
    })();
    return () => controller.abort();
  }, [key, knownAt]);

  const active = result?.key === key ? result : null;
  const data = active && "data" in active ? active.data : null;
  const assetId = params.get("asset") || data?.asset.id;
  const site = data?.sites.find(item => item.id === assetId || item.units.some(unit => unit.id === assetId));
  const unit = site?.units.find(item => item.id === assetId);
  const invalidAsset = data && !site && assetId !== data.asset.id;
  const other = view === "map" ? "terminal" : "map";
  const handoff = data && !invalidAsset && (!unit || unit.identityState === "VERIFIED")
    ? endpoints[other] + "?" + new URLSearchParams({
      asset: unit?.id ?? site?.id ?? data.asset.id,
      known_at: knownAt || data.version.retrievedAt,
    })
    : null;
  const evidenceIds = site?.evidenceIds ?? (data ? [data.asset.evidenceId, data.concession.evidenceId] : []);
  const showAsset = data && normalized(data.asset.name + " " + data.asset.ceg).includes(normalized(query));
  const selectAsset = (id: string) => {
    const next = new URLSearchParams(params);
    next.set("asset", id);
    setParams(next);
  };

  return (
    <main className="g2-terminal bm-inspector" data-tone={dark ? "graphite" : "paper"}>
      <header className="bm-header">
        <Link to="/br/terminal" aria-label="Voltar ao Terminal Brasil"><Wordmark height={22} /></Link>
        <span>{titles[view]}</span>
        <button type="button" onClick={() => setTone(dark ? "paper" : "graphite")}
          aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}>
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </header>
      <div className="bm-page">
        <div className="bm-heading">
          <h1>{data?.asset.name ?? "Belo Monte"}</h1>
          {handoff && <Link className="bm-action" to={handoff}>Abrir em {titles[other]} →</Link>}
        </div>
        {data && <p className="bm-meta">{data.asset.region} · {data.asset.technology} · CEG {data.asset.ceg}</p>}
        {!active && <p role="status">Consultando evidência…</p>}
        {active && "error" in active && (
          <div className="bm-panel" role="status">
            <p>{active.error}</p>
            {knownAt
              ? <Link className="bm-source-link" to={endpoints[view]}>Consultar última versão aprovada</Link>
              : <Link className="bm-source-link" to="/conta">Acessar conta</Link>}
          </div>
        )}
        {data && (
          <>
            <div className="bm-toolbar">
              <label>Versão conhecida pelo ARGOS
                <select value={knownAt ? data.version.retrievedAt : ""} onChange={event => {
                  const next = new URLSearchParams(params);
                  if (event.target.value) next.set("known_at", event.target.value);
                  else next.delete("known_at");
                  setParams(next);
                }}>
                  <option value="">Última versão aprovada</option>
                  {[...data.availableVersions].reverse().map(version => (
                    <option value={version.retrievedAt} key={version.id}>{date(version.retrievedAt)}</option>
                  ))}
                </select>
              </label>
              <span className="bm-meta">Captura ONS · {date(data.version.retrievedAt)}</span>
            </div>
            <div className="bm-layout">
              <nav className="bm-panel bm-tree" aria-label="Empreendimento e unidades">
                <label>Buscar empreendimento
                  <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Nome ou CEG" />
                </label>
                {showAsset ? (
                  <ul>
                    <li><button type="button" aria-current={assetId === data.asset.id} onClick={() => selectAsset(data.asset.id)}>
                      Complexo Belo Monte
                    </button></li>
                    {data.sites.map(item => (
                      <li className="bm-site" key={item.id}>
                        <button type="button" aria-current={assetId === item.id} onClick={() => selectAsset(item.id)}>
                          {item.name} · {item.units.length} unidades
                        </button>
                        {site?.id === item.id && (
                          <ul className="bm-units">
                            {item.units.map(child => (
                              <li key={child.id}><button type="button" aria-current={assetId === child.id}
                                onClick={() => selectAsset(child.id)}>UG {child.unitNumber}</button></li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : <p role="status">Nenhum empreendimento encontrado.</p>}
              </nav>
              <section className="bm-panel bm-detail" aria-label="Inspeção do ativo">
                {invalidAsset ? <p role="status">Identidade do ativo não resolvida.</p> : (
                  <>
                    <h2>{unit ? site?.name + " · UG " + unit.unitNumber : site?.name ?? "Empreendimento"}</h2>
                    {unit ? (
                      <>
                        <p className="bm-meta">Código ONS · <code>{unit.equipmentCode}</code></p>
                        <p>{unit.identityState === "VERIFIED" ? "Identidade verificada nesta versão"
                          : unit.identityState === "UNKNOWN" ? "Unidade ausente nesta captura" : "Vínculo da unidade não resolvido"}</p>
                        {unit.operationEntryDate && <p>Entrada em operação informada em {unit.operationEntryDate}</p>}
                        <div className="bm-value">
                          <span>Potência nominal da unidade</span>
                          <strong>{unit.observation ? mw(unit.observation.value) : "Sem valor disponível"}</strong>
                        </div>
                        {unit.observation?.comparison && (
                          <p>Versão anterior aprovada · {mw(unit.observation.comparison.fromMW)} · variação {mw(unit.observation.comparison.changeMW)}</p>
                        )}
                      </>
                    ) : site ? (
                      <>
                        <p className="bm-meta">Casa de força · rótulo no ONS <code>{site.sourceLabel}</code></p>
                        <p>{site.units.filter(item => item.identityState === "VERIFIED").length} de {site.units.length} unidades verificadas na captura selecionada.</p>
                      </>
                    ) : (
                      <>
                        <dl className="bm-definition">
                          <dt>Concessionária</dt><dd>{data.concession.company.name} · CNPJ {data.concession.company.cnpj}</dd>
                          <dt>Contrato</dt><dd>{data.concession.instrument} · outorga de {data.concession.effectiveFrom}</dd>
                        </dl>
                        <div className="bm-value">
                          <span>Soma da potência nominal das unidades verificadas</span>
                          <strong>{data.totalMW ? mw(data.totalMW) : "Sem total verificável"}</strong>
                        </div>
                      </>
                    )}
                    {data.state === "UNRESOLVED" && (
                      <p role="status">A captura tem vínculos por resolver{data.unreviewedUnitCount > 0 ? " e códigos novos pendentes de revisão" : ""}.</p>
                    )}
                    <details className="bm-evidence">
                      <summary>Verificar evidência</summary>
                      <p className="bm-meta">Referência do ativo · <code>{assetId}</code></p>
                      {unit?.observation && <p className="bm-meta">Observação · <code>{unit.observation.id}</code></p>}
                      <ul>
                        {data.documents.filter(doc => evidenceIds.includes(doc.id)).map(doc => (
                          <li key={doc.id}><SourceLink url={doc.url}>{doc.label}</SourceLink> · {doc.date}</li>
                        ))}
                        <li><SourceLink url={data.source.url}>{data.source.label}</SourceLink></li>
                        <li><SourceLink url={data.source.dictionaryUrl}>Dicionário do ONS · campo val_potenciaefetiva</SourceLink></li>
                      </ul>
                      <dl className="bm-definition">
                        <dt>Versão do snapshot</dt><dd><code>{data.version.id}</code></dd>
                        <dt>Data de captura</dt><dd><time dateTime={data.version.retrievedAt}>{data.version.retrievedAt}</time></dd>
                        <dt>SHA-256</dt><dd><code>{data.version.sha256}</code></dd>
                        <dt>Publicação da versão na fonte</dt><dd>{data.version.publishedAt ? date(data.version.publishedAt) : "Data desconhecida"}</dd>
                        <dt>Parser</dt><dd><code>{data.version.parserVersion}</code></dd>
                        <dt>Registro de direitos</dt><dd><code>{data.version.rightsRecordRef}</code></dd>
                        {data.comparison && <>
                          <dt>Comparação desde</dt><dd>{date(data.comparison.fromVersion.retrievedAt)}</dd>
                          <dt>Bytes de origem</dt><dd>{data.comparison.rawBytesChanged ? "Alterados" : "Iguais"}</dd>
                          <dt>Conteúdo interpretado</dt><dd>{data.comparison.parsedContentChanged ? "Alterado" : "Igual"}</dd>
                        </>}
                      </dl>
                    </details>
                  </>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
