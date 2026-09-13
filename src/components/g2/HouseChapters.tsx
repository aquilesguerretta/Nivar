import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { FamilyEmblem } from "./Brand";
import { familyPath } from "./family-path";
import { SectionLabel } from "./NivarShell";
import { AriadneJourney } from "./AriadneJourney";
import { AdvisoryExamination } from "./AdvisoryExamination";
import { CopperStudy } from "./CopperStudy";
import "./house-chapters.css";

type FamilyChapter = { id: string; name: string; verb: string; n: string; title: string; desc: string; product: string; productPath: string };
const CHAPTER_ART: Record<string, { asset: string; patron: string; detail: string }> = {
  intelligence: { asset: "transmission-territory", patron: "Argos", detail: "ATENÇÃO / CONTEXTO / LEITURA" },
  advisory: { asset: "advisory-examination", patron: "Sócrates", detail: "PREMISSA / EVIDÊNCIA / CONTRADITÓRIO" },
  academy: { asset: "academy-transparency", patron: "Perseu", detail: "CONCEITO / COMPREENSÃO / AUTONOMIA" },
  software: { asset: "substation-rain", patron: "Ariadne", detail: "ORIGEM / RELAÇÃO / PERCURSO" },
  hardware: { asset: "copper-connection", patron: "Hefesto", detail: "GRANDEZA / INSTRUMENTO / REGISTRO" },
};

/** Normal document scrolling, with a persistent index; never hijacks the wheel.
 * Every chapter and link remains present when animation is disabled. */
export function HouseChapters({ families }: { families: FamilyChapter[] }) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const root = section.current?.closest(".g2-shell");
    if (!root) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const chapters = section.current?.querySelectorAll<HTMLElement>(".g21-house-chapter");
      if (!chapters) return;
      const target = root.getBoundingClientRect().top + root.clientHeight * .42;
      let closest = Infinity;
      let index = 0;
      chapters.forEach((node, i) => {
        const rect = node.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * .45 - target);
        if (distance < closest) { closest = distance; index = i; }
        const progress = Math.max(-1, Math.min(1, (rect.top - target) / root.clientHeight));
        node.style.setProperty("--chapter-drift", `${progress * 18}px`);
      });
      setActive(index);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { root.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);
  const select = (id: string) => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    document.getElementById(`g21-house-${id}`)?.scrollIntoView({ behavior, block: "center" });
  };
  return (
    <section className="g21-house g2-container" id="a-casa" ref={section} aria-label="A arquitetura da casa">
      <aside className="g21-house-intro">
        <SectionLabel number="01">A arquitetura da casa</SectionLabel>
        <h2>Uma casa.<br /><em>Cinco formas<br />de investigar.</em></h2>
        <p>Capacidades que se completam.<br />A independência em comum.</p>
        <div className="g21-house-nav" role="group" aria-label="Ir para uma família">
          {families.map((f, i) => <button key={f.id} onClick={() => select(f.id)} aria-pressed={active === i}><span>{f.n}</span><FamilyEmblem family={f.id} size={24} decorative /><span>{f.name}</span><ArrowUpRight size={14} /></button>)}
        </div>
        <div className="g21-house-note"><span>NULLIUS IN VERBA.</span><p>Não tome nossa palavra.<br />Examine a evidência.</p></div>
      </aside>
      <div className="g21-house-story">
        {families.map((f, i) => {
          const art = CHAPTER_ART[f.id];
          return <article className="g21-house-chapter" id={`g21-house-${f.id}`} key={f.id} data-active={active === i} data-family={f.id}>
            <div className="g21-house-chapter-top"><span>{f.n} / {art.patron.toLocaleUpperCase("pt-BR")}</span><span>{f.verb.toLocaleUpperCase("pt-BR")}</span></div>
            <Link className="g21-house-title" to={familyPath(f.id)}><h3>{f.name}</h3><ArrowUpRight size={29} /></Link>
            {f.id === "software" ? <AriadneJourney compact /> : f.id === "advisory" ? <AdvisoryExamination compact /> : <div className="g21-house-collage">
              {f.id === "hardware" ? <CopperStudy /> : <picture><source media="(max-width:700px)" srcSet={`/g2/g21/${art.asset}-mobile.webp`} /><img src={`/g2/g21/${art.asset}.webp`} alt="" loading="lazy" /></picture>}
              <div className="g21-house-portrait"><FamilyEmblem family={f.id} variant="hero" size={310} decorative /></div>
              <span className="g21-house-photo-credit">CENA ILUSTRATIVA GERADA</span>
              <span className="g21-house-verb">{f.verb}.</span>
            </div>}
            <div className="g21-house-caption"><div><h4>{f.title}</h4><p>{f.desc}</p></div><Link to={f.productPath}><span>{f.product}</span><ArrowUpRight size={19} /></Link></div>
            <span className="g21-house-method">{art.detail}</span>
          </article>;
        })}
      </div>
    </section>
  );
}
