import { useId, useRef, useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { METHOD_HOURS, METHOD_SAMPLES, METHOD_SOURCE, compareMethodSamples } from "./method-evidence";
import "./method-workbench.css";

const GESTURES = [
  {verb:"Medir",patron:"Hefesto",title:"Um instante. Uma grandeza.",question:"O que foi registrado?"},
  {verb:"Organizar",patron:"Ariadne",title:"Uma sequência com contexto.",question:"O que permanece junto?"},
  {verb:"Observar",patron:"Argos",title:"A comparação muda a leitura.",question:"Quais instantes você compara?"},
  {verb:"Questionar",patron:"Sócrates",title:"A afirmação suporta o exame?",question:"O que a evidência permite afirmar?"},
  {verb:"Transmitir",patron:"Perseu",title:"A leitura leva seus limites.",question:"O que pode seguir adiante?"},
];
const CLAIMS = [
  {text:"A diferença entre 00:00 e 20:00 é de 40 MW.",verdict:"Sustentada pelos dois registros.",why:"108 − 68 = 40 MW. A afirmação se limita aos extremos observados; não descreve os intervalos."},
  {text:"A potência cresceu continuamente ao longo do dia.",verdict:"A sequência não sustenta a afirmação.",why:"Há uma queda de 68 para 64 MW e faltam observações em 08:00 e 16:00. Conectar todos os pontos inventaria uma trajetória."},
  {text:"Não houve produção às 08:00.",verdict:"Ausência não é zero.",why:"Não existe observação nesse horário. Sem medição, não se pode atribuir um valor nem concluir o que ocorreu."},
];
const number = (value:number) => value.toLocaleString("pt-BR",{maximumFractionDigits:1});

export function MethodWorkbench({ initialObservation = 0 }: { initialObservation?: number }) {
  const id=useId();
  const [step,setStep]=useState(0),[observation,setObservation]=useState(initialObservation);
  const [from,setFrom]=useState(0),[to,setTo]=useState(5),[claim,setClaim]=useState(1);
  const [copyState,setCopyState]=useState(""),[showCopy,setShowCopy]=useState(false);
  const tabs=useRef<(HTMLButtonElement|null)[]>([]);
  const comparison=compareMethodSamples(from,to);
  const value=METHOD_SAMPLES[observation];
  const reading=comparison
    ? `Entre ${METHOD_HOURS[from]} e ${METHOD_HOURS[to]}, a potência registrada passou de ${METHOD_SAMPLES[from]} para ${METHOD_SAMPLES[to]} MW (${comparison.change>=0?"+":""}${number(comparison.change)} MW). ${comparison.gaps ? `Há ${comparison.gaps} ${comparison.gaps === 1 ? "intervalo" : "intervalos"} sem observação. A trajetória entre registros permanece desconhecida.` : "A comparação se limita aos registros observados."}`
    : "A comparação escolhida não permite calcular uma diferença: selecione dois registros presentes, em ordem temporal.";
  const note=`${reading}\n\n${CLAIMS[claim].text}\n${CLAIMS[claim].verdict} ${CLAIMS[claim].why}\n\nFonte: ${METHOD_SOURCE}. Exemplo de método, sem correspondência com uma instalação real.`;
  async function copy() {
    try { await navigator.clipboard.writeText(note); setCopyState("Leitura copiada com fonte e limites."); }
    catch { setShowCopy(true); setCopyState("Selecione o texto abaixo para copiar."); }
  }
  function go(next:number, focus=false) { setStep(next); if(focus) tabs.current[next]?.focus(); }
  return <div className="g23-method-workbench">
    <div className="g23-method-intro"><span>EV–001 / CADERNO DE MÉTODO</span><p>A mesma evidência.<br /><em>Uma pergunta diferente a cada gesto.</em></p></div>
    <div className="g23-method-tabs" role="tablist" aria-label="Gestos do método">
      {GESTURES.map((gesture,index)=><button type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel`} aria-selected={step===index} tabIndex={step===index?0:-1} key={gesture.verb} ref={node=>{tabs.current[index]=node;}} onClick={()=>go(index)} onKeyDown={event=>{let next=step;if(event.key==="ArrowRight"||event.key==="ArrowDown")next=(step+1)%5;else if(event.key==="ArrowLeft"||event.key==="ArrowUp")next=(step+4)%5;else if(event.key==="Home")next=0;else if(event.key==="End")next=4;else return;event.preventDefault();go(next,true);}}><span>0{index+1}</span><b>{gesture.verb}</b><small>{gesture.patron}</small></button>)}
    </div>
    <section className="g23-method-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${step}`} tabIndex={0}>
      <div className="g23-method-panel-head"><span>{GESTURES[step].question}</span><h3>{GESTURES[step].title}</h3></div>
      {step===0&&<>
        <div className="g23-method-observation"><strong>{value??"—"}<small>{value===null?"sem observação":"MW"}</small></strong><dl><div><dt>Instante</dt><dd>{METHOD_HOURS[observation]}</dd></div><div><dt>Natureza</dt><dd>Sintética / didática</dd></div><div><dt>Fonte</dt><dd>NIVAR · EV–001</dd></div></dl></div>
        <div className="g23-method-samples" role="group" aria-label="Escolher um registro">{METHOD_SAMPLES.map((sample,index)=><button type="button" key={index} aria-pressed={observation===index} aria-label={`${METHOD_HOURS[index]}: ${sample===null?"sem observação":`${sample} MW`}`} onClick={()=>setObservation(index)}><span>{METHOD_HOURS[index]}</span><b>{sample??"—"}</b><small>{sample===null?"ausente":"MW"}</small></button>)}</div>
        <p className="g23-method-consequence">{value===null?"Nenhum valor foi observado neste instante. A lacuna permanece no registro; não se substitui por zero.":"Um valor só pode ser examinado se a grandeza, a unidade, o instante e a origem continuarem junto dele."}</p>
      </>}
      {step===1&&<><div className="g23-method-table"><table><caption>Quatro observações e duas lacunas, preservadas na mesma sequência.</caption><thead><tr><th scope="col">Instante</th><th scope="col">Potência</th><th scope="col">Estado do registro</th></tr></thead><tbody>{METHOD_SAMPLES.map((sample,index)=><tr key={index} data-missing={sample===null}><th scope="row">{METHOD_HOURS[index]}</th><td>{sample===null?"—":`${sample} MW`}</td><td>{sample===null?"Sem observação":"Observação sintética"}</td></tr>)}</tbody></table></div><p className="g23-method-consequence">A ordem conserva os dois intervalos ausentes. Organizar também é impedir que uma lacuna desapareça.</p></>}
      {step===2&&<><div className="g23-method-comparison-controls"><label>Primeiro instante<select value={from} onChange={event=>setFrom(Number(event.target.value))}>{METHOD_HOURS.map((hour,index)=><option value={index} key={hour}>{hour}{METHOD_SAMPLES[index]===null?" · ausente":""}</option>)}</select></label><ArrowRight size={20}/><label>Último instante<select value={to} onChange={event=>setTo(Number(event.target.value))}>{METHOD_HOURS.map((hour,index)=><option value={index} key={hour}>{hour}{METHOD_SAMPLES[index]===null?" · ausente":""}</option>)}</select></label></div><div className="g23-method-delta" aria-live="polite"><strong>{comparison?`${comparison.change>0?"+":""}${number(comparison.change)}`:"—"}<small>{comparison?"MW entre os registros":"comparação indisponível"}</small></strong><p>{reading}</p></div><p className="g23-method-consequence">Mude os instantes. Compare 00:00 com 04:00; depois inclua uma ausência. A conclusão deve mudar junto com a evidência.</p></>}
      {step===3&&<><fieldset className="g23-method-claims"><legend>Escolha uma afirmação para colocá-la à prova.</legend>{CLAIMS.map((item,index)=><label key={item.text}><input type="radio" name={`${id}-claim`} checked={claim===index} onChange={()=>setClaim(index)}/><span>{item.text}</span></label>)}</fieldset><div className="g23-method-verdict" aria-live="polite"><span>RESULTADO DO EXAME</span><h4>{CLAIMS[claim].verdict}</h4><p>{CLAIMS[claim].why}</p></div></>}
      {step===4&&<><article className="g23-method-reading"><span>NOTA DE LEITURA / SUA EXPLORAÇÃO</span><p>{reading}</p><p><b>{CLAIMS[claim].verdict}</b> {CLAIMS[claim].why}</p><small>{METHOD_SOURCE}. Sem correspondência com uma instalação real.</small></article><button type="button" className="g23-method-copy" onClick={copy}>{copyState.startsWith("Leitura copiada")?<Check size={16}/>:<Copy size={16}/>}Copiar leitura com a fonte</button><span className="g23-method-copy-status" role="status">{copyState}</span>{showCopy&&<textarea aria-label="Leitura para copiar" readOnly value={note} onFocus={event=>event.currentTarget.select()}/>}</>}
      <div className="g23-method-next"><span>{METHOD_SOURCE}</span>{step<4?<button type="button" onClick={()=>go(step+1,true)}>Próximo gesto<ArrowRight size={15}/></button>:<button type="button" onClick={()=>go(0,true)}>Reabrir a investigação<ArrowRight size={15}/></button>}</div>
    </section>
  </div>;
}
