import { ArrowRight, ArrowUpRight, ChevronRight, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { FamilyInsignia, type FamilyInsigniaName } from "../../components/g2/FamilyInsignia";
import { ARGOS_INSPECTION_SCENARIOS } from "../../lib/argos/signalInspectionApi";
import { DESTINOS_BR } from "../../lib/data/br-destinos";
import { nomeDoProduto, PRODUTOS_COM_FILA } from "../../lib/operador/catalogo";
import { filaDe } from "../../lib/operador/mock";
import { closeDeskPath, operatorFamiliesPath, operatorPlanningEnabled, planningPath } from "./operatorWorkspaceRoutes";

export const familyPath = (id: FamilyInsigniaName) => `${operatorFamiliesPath}/${id}`;

type Destination = {
  to: string;
  label: string;
  description: string;
  detail?: string;
  outside?: boolean;
};

type Family = {
  id: FamilyInsigniaName;
  name: string;
  status: string;
  description: string;
  destinations: readonly Destination[];
};

function buildFamilies(): readonly Family[] {
  const advisoryProducts = PRODUTOS_COM_FILA.filter(({ familiaId }) => familiaId === "advisory").map(
    ({ produtoId }): Destination => ({
      to: `/operador/${produtoId}`,
      label: nomeDoProduto(produtoId),
      description: DESTINOS_BR.find(({ id }) => id === produtoId)?.descricao ?? "",
      detail: `${filaDe(produtoId).length} pedidos na amostra`,
    }),
  );

  const alexandria = DESTINOS_BR.find(({ id }) => id === "alexandria");

  return [
    {
      id: "intelligence",
      name: "Intelligence",
      status: "Inspeção sintética",
      description: "Rastreie mudanças do território até a evidência preservada no Argos.",
      destinations: [{
        to: "/operador/argos",
        label: "Argos",
        description: "Percorra detecção, observação, evidência e resultado.",
        detail: `${ARGOS_INSPECTION_SCENARIOS.length} cenários sintéticos`,
      }],
    },
    {
      id: "advisory",
      name: "Advisory",
      status: "Fila ilustrativa",
      description: "Examine pedidos de demonstração, as fontes e o caderno de análise.",
      destinations: [
        {
          to: "/operador",
          label: "Todos os pedidos",
          description: "Abra a fila completa e filtre por cliente, protocolo ou estado.",
          detail: `${filaDe().length} pedidos na amostra`,
        },
        ...advisoryProducts,
      ],
    },
    {
      id: "academy",
      name: "Academy",
      status: "Sem fluxo no Operador",
      description: "Consulte o acervo e as trilhas de formação em energia na Alexandria.",
      destinations: alexandria?.rota ? [{
        to: alexandria.rota,
        label: alexandria.titulo,
        description: alexandria.descricao,
        detail: "Biblioteca",
        outside: true,
      }] : [],
    },
    {
      id: "software",
      name: "Software",
      status: "Em avaliação",
      description: "Revise evidências, preserve resultados e explore cenários na Ariadne.",
      destinations: [
        { to: closeDeskPath, label: "Mesa de revisão", description: "Organize fontes, examine diferenças e preserve a revisão.", detail: "Desenvolvimento" },
        ...(operatorPlanningEnabled ? [{
          to: planningPath, label: "Planejamento", description: "Estime o impacto da demanda contratada a partir de uma revisão preservada.", detail: "Desenvolvimento",
        }] : []),
        { to: "/operador/ariadne", label: "Ariadne Core", description: "Abra workspaces, versões, cenários e o histórico de execuções.", detail: "Alpha interno" },
      ],
    },
    {
      id: "hardware",
      name: "Hardware",
      status: "Sem fluxo no Operador",
      description: "Acompanhamento de equipamentos.",
      destinations: [],
    },
  ];
}

export const families = import.meta.env.DEV ? buildFamilies() : [];

function FamilyStatus({ family }: { family: Family }) {
  return (
    <span className="ow-status" data-available={family.destinations.some((item) => !item.outside)}>
      <span aria-hidden />{family.status}
    </span>
  );
}

export function OperatorFamiliesOverview() {
  return (
    <div className="ow-page">
      <header className="ow-page__intro">
        <h1>Visão geral</h1>
        <p>Encontre um espaço de trabalho e veja o que está disponível em cada família NIVAR.</p>
      </header>
      <div className="ow-dashboard">
        <section className="ow-panel" aria-labelledby="ow-families-title">
          <div className="ow-panel__title">
            <h2 id="ow-families-title">Famílias NIVAR</h2>
            <span>{families.length} famílias</span>
          </div>
          <ul className="ow-list">
            {families.map((family) => (
              <li key={family.id}>
                <Link className="ow-row ow-row--family" to={familyPath(family.id)}>
                  <span className="ow-row__mark"><FamilyInsignia family={family.id} size={20} decorative /></span>
                  <span className="ow-row__text"><strong>{family.name}</strong><small>{family.description}</small></span>
                  <FamilyStatus family={family} />
                  <ChevronRight size={16} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="ow-panel" aria-labelledby="ow-access-title">
          <div className="ow-panel__title"><h2 id="ow-access-title">Acesso rápido</h2></div>
          <ul className="ow-list">
            <li><Link className="ow-shortcut" to={closeDeskPath}><span>Mesa de revisão<small>Software · Ariadne</small></span><ArrowRight size={16} aria-hidden /></Link></li>
            <li><Link className="ow-shortcut" to="/operador"><span>Todos os pedidos<small>Advisory · {filaDe().length} na amostra</small></span><ArrowRight size={16} aria-hidden /></Link></li>
            <li><Link className="ow-shortcut" to="/operador/argos"><span>Inspecionar sinais<small>Intelligence · Argos</small></span><ArrowRight size={16} aria-hidden /></Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export function OperatorFamilyPage({ family }: { family: Family }) {
  return (
    <div className="ow-page">
      <header className="ow-page__intro">
        <div className="ow-page__identity">
          <span className="ow-page__mark"><FamilyInsignia family={family.id} size={28} decorative /></span>
          <h1>{family.name}</h1>
          <FamilyStatus family={family} />
        </div>
        <p>{family.description}</p>
      </header>
      {family.destinations.length ? (
        <section className="ow-panel" aria-labelledby="ow-products-title">
          <div className="ow-panel__title">
            <h2 id="ow-products-title">{family.id === "academy" ? "Acervo" : "Espaços de trabalho"}</h2>
          </div>
          <ul className="ow-list">
            {family.destinations.map(({ to, label, description, detail, outside }) => (
              <li key={to}>
                <Link className="ow-row ow-row--product" to={to}>
                  <span className="ow-row__text"><strong>{label}</strong><small>{description}</small></span>
                  <span className="ow-row__detail">{detail}</span>
                  {outside ? <ArrowUpRight size={16} aria-hidden /> : <ChevronRight size={16} aria-hidden />}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="ow-panel ow-unavailable">
          <PackageOpen size={23} aria-hidden />
          <h2>Nenhum fluxo de equipamentos disponível</h2>
          <p>Inventário e leituras de equipamentos ainda não estão disponíveis neste espaço.</p>
          <Link className="g2-ops__button" to={operatorFamiliesPath}>Voltar à visão geral <ArrowRight size={15} aria-hidden /></Link>
        </section>
      )}
    </div>
  );
}
