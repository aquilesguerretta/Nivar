import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Minus, Plus, X } from "lucide-react";
import { Wordmark } from "./Brand";
import { MethodWorkbench } from "./MethodWorkbench";
import { METHOD_HOURS, METHOD_SAMPLES } from "./method-evidence";
import { useNivarTheme } from "./nivar-theme";
import "./house-finale.css";

/** EV-001 is a synthetic lesson. Selecting a gap never produces zero. */
export function HouseFinale() {
  const [sample, setSample] = useState(0);
  const [sourceOpen, setSourceOpen] = useState(false);
  const notebook = useRef<HTMLDialogElement>(null);
  const dark = useNivarTheme();
  const portrait = dark ? "/g2/g23/finale/diogenes-night" : "/g2/g22/finale/diogenes-gesture";
  const value = METHOD_SAMPLES[sample];
  return <section className="g22-finale" id="a-pergunta-continua" aria-labelledby="g22-finale-title" data-source-open={sourceOpen}>
    <div className="g22-finale-stage g2-container">
      <header className="g22-finale-heading">
        <span className="g22-finale-kicker">06 / A CASA · DIÓGENES</span>
        <h2 id="g22-finale-title">A pergunta<br /><em>permanece aberta.</em></h2>
        <p>O compromisso é com a pergunta.<br />Mesmo quando a resposta muda.</p>
      </header>
      <div className="g22-finale-figure" aria-hidden="true">
        <img src={`${portrait}-1536.webp`} srcSet={`${portrait}-900.webp 900w, ${portrait}-1536.webp 1536w`} sizes="(max-width: 700px) 110vw, 80vw" width="1536" height="1024" loading="lazy" decoding="async" alt="" />
      </div>
      <div className="g22-finale-aperture">
        <div className="g22-finale-aperture-head"><span>EV–001 / O MESMO REGISTRO</span><span>ESTUDO DIDÁTICO · MW</span></div>
        <div className="g22-finale-evidence" aria-live="polite" aria-atomic="true">
          <div className="g22-finale-origin"><strong>{value ?? "—"}<small>{value === null ? "ausente" : "MW"}</small></strong><span>{METHOD_HOURS[sample]} / AMOSTRA 0{sample + 1}</span></div>
          <p>{value === null ? "Nenhuma observação disponível. A ausência não significa zero." : "Um instante registrado. A trajetória entre as medições ainda precisa ser examinada."}</p>
        </div>
        <div className="g23-finale-samples" role="group" aria-label="Selecionar uma observação da série didática">
          {METHOD_SAMPLES.map((v, i) => <button key={METHOD_HOURS[i]} type="button" aria-pressed={sample === i} aria-label={`${METHOD_HOURS[i]}: ${v === null ? "dado ausente" : `${v} MW`}`} data-missing={v === null} onClick={() => setSample(i)}><span>{METHOD_HOURS[i]}</span><b>{v ?? "—"}</b></button>)}
        </div>
        <div className="g22-finale-aperture-copy"><p>Quatro observações. Duas lacunas.<br /><em>Que afirmação resiste ao exame?</em></p><span>Série sintética NIVAR. Sem correspondência com uma usina real.</span></div>
        <button className="g22-finale-reveal" type="button" aria-expanded={sourceOpen} aria-controls="g22-finale-source" onClick={() => setSourceOpen(v => !v)}><span>{sourceOpen ? "Recolher a origem" : "Iluminar origem e limites"}</span>{sourceOpen ? <Minus size={16} /> : <Plus size={16} />}</button>
        <aside className="g22-finale-source-note" id="g22-finale-source" hidden={!sourceOpen}>
          <span className="g22-finale-kicker">DIÓGENES / EXAMINAR A ORIGEM</span><p>Uma série criada para examinar o método.</p>
          <dl><div><dt>Fonte</dt><dd>Série sintética NIVAR · EV-001</dd></div><div><dt>Período</dt><dd>Dia didático · 00:00–20:00</dd></div><div><dt>Limite</dt><dd>Sem dado em 08:00 e 16:00. Sem interpolação. Sem conclusão sobre uma instalação real.</dd></div></dl>
          <Link to="/br/metodo">Abrir fonte e método <ArrowUpRight size={14} /></Link>
        </aside>
        <button className="g22-finale-notebook-open" type="button" onClick={() => notebook.current?.showModal()}>Experimentar os cinco gestos <ArrowUpRight size={15} /></button>
      </div>
      <footer className="g22-finale-resolution">
        <div className="g22-finale-open-question"><span>06 / PROCURAR</span><p>O que falta medir?</p></div>
        <Link className="g22-finale-enter" to="/criar-conta">Entre na casa <ArrowRight size={19} /></Link>
        <div className="g22-finale-signature"><Wordmark height={25} /><span>Nullius in verba.</span></div>
      </footer>
    </div>
    <dialog className="g22-finale-notebook" ref={notebook} aria-labelledby="g22-notebook-title" onClick={event => { if (event.target === event.currentTarget) notebook.current?.close(); }}>
      <div className="g22-notebook-paper"><header className="g22-notebook-header"><div><span className="g22-finale-kicker">EV–001 / UM REGISTRO. CINCO GESTOS.</span><h3 id="g22-notebook-title">O método deixa vestígios.</h3></div><button type="button" aria-label="Fechar caderno" onClick={() => notebook.current?.close()}><X size={21} /></button></header><MethodWorkbench key={sample} initialObservation={sample} /></div>
    </dialog>
  </section>;
}
