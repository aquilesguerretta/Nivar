import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import { FamilyEmblem, Wordmark } from "./Brand";
import "./hero-film.css";

const MEDIA_ROOT = "/g2/g232/hero";
const prefersStill = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PATRONS = [
  { name: "Hefesto", family: "Hardware", verb: "Medir e construir" },
  { name: "Ariadne", family: "Software", verb: "Organizar" },
  { name: "Argos", family: "Intelligence", verb: "Observar" },
  { name: "Sócrates", family: "Advisory", verb: "Questionar" },
  { name: "Perseu", family: "Academy", verb: "Transmitir" },
  { name: "Diógenes", family: "A casa", verb: "Procurar" },
] as const;

/** The edited film owns its clock, cuts and ending. The page only manages
 * playback, visibility and the visitor's explicit motion/audio preferences. */
export function HeroFilm({ className = "" }: { className?: string }) {
  const figure = useRef<HTMLElement>(null);
  const aperture = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  // Choose one master per visit. Resizing never starts a second film download.
  const [mobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches);
  const [reduced, setReduced] = useState(prefersStill);
  const [still, setStill] = useState(prefersStill);
  const [wantsToPlay, setWantsToPlay] = useState(() => !prefersStill());
  const [playing, setPlaying] = useState(false);
  const [complete, setComplete] = useState(false);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [visible, setVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const [failed, setFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const source = `${MEDIA_ROOT}/nivar-energia-${mobile ? "mobile" : "desktop"}.mp4`;
  const poster = `${MEDIA_ROOT}/${mobile ? "mobile-poster" : "nivar-energia-poster"}.webp`;
  const mediaMounted = hasEntered && !still && !failed;
  const shouldPlay = mediaMounted && wantsToPlay && !complete && inView && visible;
  const showStill = still || failed;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changePreference = () => {
      setReduced(preference.matches);
      if (preference.matches) {
        setStill(true);
        setWantsToPlay(false);
        setPlaying(false);
        setHasFrame(false);
        setComplete(false);
      }
    };
    const changeVisibility = () => setVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      const intersects = entry.isIntersecting && entry.intersectionRatio > 0.12;
      setInView(intersects);
      if (intersects) setHasEntered(true);
    }, { threshold: [0, 0.12] });
    if (aperture.current) observer.observe(aperture.current);
    preference.addEventListener("change", changePreference);
    document.addEventListener("visibilitychange", changeVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", changePreference);
      document.removeEventListener("visibilitychange", changeVisibility);
    };
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const isStillMounted = () => video.current === element;
    let cancelled = false;
    if (shouldPlay) {
      void element.play().catch((error: unknown) => {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) return;
        setWantsToPlay(false);
        setPlaying(false);
        if (error instanceof DOMException && error.name === "NotAllowedError") setNeedsGesture(true);
        else { setFailed(true); setHasFrame(false); }
      });
    } else element.pause();
    return () => {
      cancelled = true;
      element.pause();
      // Detaching a playing video does not reliably cancel its network request.
      // Release it on unmount, while ordinary pauses retain the buffered film.
      if (!isStillMounted()) {
        element.removeAttribute("src");
        element.load();
      }
    };
  }, [shouldPlay, mediaMounted]);

  // Keep an intact patron on screen if a connection never delivers the film.
  // There is no loading spinner and a failed load always offers an explicit retry.
  useEffect(() => {
    if (!shouldPlay || (hasFrame && !waiting)) return;
    const timeout = window.setTimeout(() => {
      setFailed(true);
      setWantsToPlay(false);
      setPlaying(false);
      setHasFrame(false);
    }, 30_000);
    return () => window.clearTimeout(timeout);
  }, [shouldPlay, hasFrame, waiting]);

  const playFromControl = () => {
    const element = video.current;
    if (element && complete) element.currentTime = 0;
    setStill(false);
    setFailed(false);
    setComplete(false);
    setNeedsGesture(false);
    setHasEntered(true);
    setWantsToPlay(true);
    // Retain the direct user gesture for browsers that restrict audible playback.
    if (element && inView && visible) {
      void element.play().catch((error: unknown) => {
        if (video.current !== element || (error instanceof DOMException && error.name === "AbortError")) return;
        setWantsToPlay(false);
        if (error instanceof DOMException && error.name === "NotAllowedError") setNeedsGesture(true);
        else { setFailed(true); setHasFrame(false); }
      });
    }
  };

  const pauseFromControl = () => { setWantsToPlay(false); video.current?.pause(); };
  const showWithoutMotion = () => {
    video.current?.pause();
    setStill(true);
    setWantsToPlay(false);
    setPlaying(false);
    setHasFrame(false);
    setComplete(false);
  };
  const toggleSound = () => {
    const next = !muted;
    if (video.current) video.current.muted = next;
    setMuted(next);
  };
  const playRequested = wantsToPlay && !showStill && !complete && !needsGesture;
  const playbackLabel = failed ? "Tentar novamente" : complete ? "Rever o filme" : showStill || needsGesture ? "Assistir ao filme" : playRequested ? "Pausar filme" : "Reproduzir filme";
  const PlaybackIcon = complete || failed ? RotateCcw : playRequested ? Pause : Play;

  return <figure id="filme-do-metodo" ref={figure} className={`g232-hero-film ${className}`}
    data-scene="energia" data-playing={playing} data-static={showStill} data-complete={complete}
    data-media-variant={mobile ? "mobile" : "desktop"} data-media-error={failed}
    aria-labelledby="nivar-energia-title">
    <div ref={aperture} className="g232-film-aperture">
      <div className="g232-film-still" aria-hidden={!showStill}>
        <FamilyEmblem family="hardware" variant="hero" size={600} decorative />
        <div className="g232-still-copy">
          <Wordmark height={24} />
          <p>Energia.<br /><em>Em movimento.</em></p>
          <span>BRASIL / A CASA NIVAR</span>
        </div>
      </div>
      {!showStill && !posterFailed && <img className="g232-film-poster" src={poster} alt="" aria-hidden="true"
        width={mobile ? 960 : 1920} height={mobile ? 720 : 1080} decoding="async"
        onError={() => setPosterFailed(true)} />}
      {mediaMounted && <video ref={video} className="g232-film-video" src={source} muted={muted} playsInline preload="none"
        data-has-frame={hasFrame} aria-label="Filme NIVAR: os patronos da casa e a energia brasileira"
        aria-describedby="nivar-energia-description" disablePictureInPicture
        onLoadedData={() => setHasFrame(true)}
        onCanPlay={() => setWaiting(false)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => { setPlaying(true); setHasFrame(true); setWaiting(false); setNeedsGesture(false); }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setComplete(true); setWantsToPlay(false); setPlaying(false); }}
        onError={() => { setFailed(true); setWantsToPlay(false); setPlaying(false); setHasFrame(false); }}
        onTimeUpdate={event => {
          if (figure.current) figure.current.dataset.filmTime = event.currentTarget.currentTime.toFixed(3);
        }} />}
    </div>
    <figcaption className="g232-film-caption">
      <div className="g232-film-heading"><span>NIVAR / BRASIL</span><h2 id="nivar-energia-title">A energia nos move.</h2></div>
      <div className="g232-film-controls" role="group" aria-label="Controles do filme">
        <button type="button" onClick={playRequested ? pauseFromControl : playFromControl} aria-label={playbackLabel}>
          <PlaybackIcon size={15} aria-hidden="true" /><span>{playbackLabel}</span>
        </button>
        {!showStill && <button type="button" onClick={toggleSound} aria-label={muted ? "Ativar som do filme" : "Silenciar filme"} aria-pressed={!muted}>
          {muted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}<span>{muted ? "Ativar som" : "Silenciar"}</span>
        </button>}
        {!showStill && <button type="button" onClick={showWithoutMotion}>Ver sem movimento</button>}
        {showStill && <span className="g232-film-status" role="status">{failed ? "O filme não pôde ser carregado." : reduced ? "Movimento reduzido" : "Sem movimento"}</span>}
      </div>
      <p id="nivar-energia-description" className="g232-film-description">Hefesto, Ariadne, Argos, Sócrates, Perseu e Diógenes. Seis presenças, uma casa.</p>
      <div className="g232-film-notes">
        <details className="g232-film-patrons"><summary>Os patronos da casa</summary><dl>{PATRONS.map(patron =>
          <div key={patron.name}><dt>{patron.name} <span>/ {patron.family}</span></dt><dd>{patron.verb}</dd></div>
        )}</dl><p>Uma criação cinematográfica sobre a NIVAR e a energia brasileira. Personagens e paisagens são interpretações artísticas.</p></details>
        <Link to="/br/terminal" className="g232-film-terminal">Explorar o Terminal <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
    </figcaption>
  </figure>;
}
