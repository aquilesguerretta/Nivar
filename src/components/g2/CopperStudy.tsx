import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import "./copper-study.css";

const POSTER = "/g2/g23/hardware/copper-motion-poster.webp";
const FILM = "/g2/g23/hardware/copper-motion-960.mp4";

/** An illustrative material study, loaded only after an explicit play request. */
export function CopperStudy() {
  const id = useId();
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(media.matches);
      if (media.matches) video.current?.pause();
    };
    update();
    media.addEventListener("change", update);
    const pauseHidden = () => {
      if (document.hidden) video.current?.pause();
    };
    document.addEventListener("visibilitychange", pauseHidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.current?.pause();
      },
      { threshold: 0.05 },
    );
    if (frame.current) observer.observe(frame.current);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", pauseHidden);
      observer.disconnect();
    };
  }, []);

  async function toggle() {
    const current = video.current;
    if (!current) return;
    if (!current.paused) {
      current.pause();
      return;
    }
    const retry = failed;
    setFailed(false);
    if (!loaded.current) {
      // No source element, fetch or video bytes before the visitor asks to play.
      current.src = FILM;
      loaded.current = true;
    }
    if (retry) current.load();
    if (current.ended) current.currentTime = 0;
    setEnded(false);
    try {
      await current.play();
      setStarted(true);
    } catch {
      setFailed(true);
      setPlaying(false);
    }
  }

  return (
    <div
      className="g23-copper-study"
      ref={frame}
      data-failed={failed || undefined}
    >
      <video
        ref={video}
        id={id}
        poster={POSTER}
        preload="none"
        muted
        playsInline
        aria-label="Estudo ilustrativo gerado de uma conexão aparafusada em cobre; sem áudio"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
        onError={() => {
          setFailed(true);
          setPlaying(false);
        }}
      />
      {failed && (
        <img
          className="g23-copper-study__fallback"
          src={POSTER}
          alt="Imagem do estudo ilustrativo gerado de uma conexão em cobre"
          width={960}
          height={540}
        />
      )}
      <div className="g23-copper-study__controls">
        <button type="button" onClick={toggle} aria-controls={id}>
          {playing ? (
            <Pause size={13} />
          ) : ended || failed ? (
            <RotateCcw size={13} />
          ) : (
            <Play size={13} />
          )}
          {playing
            ? "Pausar estudo"
            : failed
              ? "Tentar reproduzir novamente"
              : ended
                ? "Examinar de novo — 6 s"
                : started
                  ? "Continuar o estudo"
                  : "Examinar a conexão — 6 s"}
        </button>
        <span role="status">
          {failed
            ? "O filme não carregou. A imagem do estudo permanece disponível."
            : reduced && !started
              ? "Imagem fixa. O movimento começa somente se você escolher."
              : "Estudo ilustrativo gerado · sem áudio"}
        </span>
      </div>
    </div>
  );
}
