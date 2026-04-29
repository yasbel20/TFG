import { useState, useEffect, useRef, useCallback } from "react";

const P = {
  yellow: "#C9D11A",
  navy:   "#1A237E",
  blue:   "#3D47C8",
  cream:  "#F2F0E6",
};

const CAT_COLORS = {
  "Música":     "#1A1A1A",
  "Teatro":     "#141414",
  "Exposición": "#181818",
  "Cine":       "#1A1A1A",
  "Danza":      "#141414",
  "Cultura":    "#111111",
  "Deporte":    "#1A1A1A",
};

const ACCESS_INFO = {
  silla:   { label: "Accesible PMR",          desc: "Espacio adaptado para personas usuarias de silla de ruedas." },
  signos:  { label: "Lengua de signos",        desc: "Interpretación en Lengua de Signos Española (LSE)." },
  bucle:   { label: "Bucle magnético",         desc: "Sistema de audio inductivo para audífonos e implantes cocleares." },
  braille: { label: "Señalización podotáctil", desc: "Pavimento táctil y señalética en Braille." },
};

// ─── Iconos ───────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, fill = "none", stroke = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {typeof d === "string" ? <path d={d}/> : d}
  </svg>
);

const ArrowLeft  = () => <Ico d="m15 18-6-6 6-6"/>;
const PlayIcon   = () => <Ico d={<polygon points="5 3 19 12 5 21 5 3"/>} fill="currentColor" stroke="none"/>;
const PauseIcon  = () => <Ico d={<><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></>} fill="currentColor" stroke="none"/>;
const StopIcon   = () => <Ico d={<rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"/>} fill="currentColor" stroke="none"/>;
const SkipBIcon  = () => <Ico d="M19 20 9 12l10-8v16zm-14 0V4"/>;
const SkipFIcon  = () => <Ico d="M5 4l10 8-10 8V4zm14 0v16"/>;
const VolumeIcon = () => <Ico d="M11 5 6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>;
const InfoIcon   = () => <Ico d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>}/>;
const CloseIcon  = () => <Ico d="M18 6 6 18M6 6l12 12"/>;
const SettingsIcon=() => <Ico d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>}/>;
const ContrastIcon=() => <Ico d={<><circle cx="12" cy="12" r="9"/><path d="M12 3v18" fill="none"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/></>}/>;
const ShareIcon  = () => <Ico d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>}/>;
const WheelIcon  = () => <Ico size={16} d={<><circle cx="12" cy="5" r="2" fill="currentColor" stroke="none"/><path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z" fill="currentColor" stroke="none"/><path d="M6 16a6 6 0 1 0 12 0" fill="none" strokeWidth={2}/></>} fill="currentColor" stroke="currentColor"/>;
const SignosIcon = () => <Ico size={16} d={<path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 9v5h2v7h4v-7h2V9H3zm14 0v5h2v7h4v-7h2V9h-8z" fill="currentColor"/>} fill="currentColor" stroke="none"/>;
const BucleIcon  = () => <Ico size={16} d={<path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm-1-9v5l4-2.5L11 10z" fill="currentColor"/>} fill="currentColor" stroke="none"/>;
const PodoIcon   = () => <Ico size={16} d={<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" fill="currentColor"/>} fill="currentColor" stroke="none"/>;
const EuroIcon   = () => <Ico d={<><circle cx="12" cy="12" r="10"/><path d="M14.5 8a4 4 0 1 0 0 8M6 10h8M6 14h8"/></>}/>;
const CalIcon    = () => <Ico d={<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>}/>;
const PinIcon    = () => <Ico size={16} d={<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>} fill="currentColor" stroke="none"/>;
const ExternalIcon=()=> <Ico d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>}/>;
const DownloadIcon=()=><Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>;
const KeyboardIcon=()=><Ico d={<><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></>}/>;
const ClickIcon  = ()=><Ico d={<><path d="M9 9l2 12 1.8-5.2L18 14z"/><path d="M9 9H3"/><path d="M9 9V3"/></>}/>;
const TextIcon   = ()=><Ico d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></>}/>;
const MaskIcon   = ()=><Ico d={<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M2 10h20" strokeDasharray="3 3"/></>}/>;
const EyeIcon    = ()=><Ico d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}/>;
const FormIcon   = ()=><Ico d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>}/>;

// ─── Toggle switch accesible ──────────────────────────────────────────────────
function Toggle({ id, checked, onChange, label }) {
  return (
    <label className="rs-toggle" htmlFor={id}>
      <span className="rs-toggle-label">{label}</span>
      <span className="rs-toggle-track" aria-hidden="true">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="rs-toggle-input"
          role="switch"
          aria-checked={checked}
        />
        <span className="rs-toggle-thumb"/>
      </span>
    </label>
  );
}

// ─── Hook Web Speech API ──────────────────────────────────────────────────────
function useSpeech(text, rate = 0.95) {
  const [status, setStatus]       = useState("idle");
  const [wordIndex, setWordIndex] = useState(-1);
  const uttRef                    = useRef(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const words = text ? text.split(/\s+/) : [];

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setStatus("idle"); setWordIndex(-1);
  }, [supported]);

  const play = useCallback(() => {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();

    // Pre-calculamos las posiciones exactas de cada palabra en el string
    // para mapear charIndex → índice de palabra sin ambigüedad
    const wordPositions = [];
    const re = /\S+/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      wordPositions.push({ start: m.index, end: m.index + m[0].length - 1 });
    }

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "es-ES"; utt.rate = rate;
    utt.onboundary = (e) => {
      if (e.name !== "word") return;
      const ci = e.charIndex;
      // Buscar qué palabra contiene este charIndex
      let idx = wordPositions.findIndex(w => ci >= w.start && ci <= w.end);
      // Fallback: palabra más cercana si no hay coincidencia exacta
      if (idx === -1) {
        idx = wordPositions.findIndex(w => ci < w.end);
      }
      if (idx === -1) idx = wordPositions.length - 1;
      setWordIndex(idx);
      const el = document.querySelector(`[data-wi="${idx}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    utt.onstart  = () => setStatus("playing");
    utt.onend    = () => { setStatus("idle"); setWordIndex(-1); };
    utt.onpause  = () => setStatus("paused");
    utt.onresume = () => setStatus("playing");
    utt.onerror  = () => { setStatus("idle"); setWordIndex(-1); };
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [supported, text, rate]);

  const pause = useCallback(() => {
    if (!supported) return;
    if (status === "playing") { window.speechSynthesis.pause(); setStatus("paused"); }
    else if (status === "paused") { window.speechSynthesis.resume(); setStatus("playing"); }
  }, [supported, status]);

  const skipBack = useCallback(() => { stop(); }, [stop]);
  const skipFwd  = useCallback(() => { stop(); }, [stop]);

  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);

  return { supported, status, wordIndex, words, play, pause, stop, skipBack, skipFwd };
}

// ─── Texto con resaltado de palabra ──────────────────────────────────────────
// Reconstruye el texto preservando espacios pero indexando solo palabras reales,
// igual que el regex /\S+/g del hook — así data-wi siempre coincide con wordIndex.
function HighlightedText({ text, wordIndex }) {
  if (!text) return null;

  // Dividir en tokens: palabras y espacios/puntuación entre ellas
  const tokens = [];
  let last = 0;
  const re = /\S+/g;
  let m;
  let wi = 0;
  while ((m = re.exec(text)) !== null) {
    // Espacio antes de la palabra
    if (m.index > last) tokens.push({ type: "space", val: text.slice(last, m.index), wi: -1 });
    tokens.push({ type: "word", val: m[0], wi: wi++ });
    last = m.index + m[0].length;
  }
  // Espacio final si lo hay
  if (last < text.length) tokens.push({ type: "space", val: text.slice(last), wi: -1 });

  return (
    <p className="ed-desc-text" aria-live="polite">
      {tokens.map((tok, i) =>
        tok.type === "space"
          ? tok.val
          : (
            <span
              key={i}
              data-wi={tok.wi}
              className={wordIndex === tok.wi ? "ed-word-hi" : ""}
            >
              {tok.val}
            </span>
          )
      )}
    </p>
  );
}

// ─── Panel de preferencias ────────────────────────────────────────────────────
function PrefsPanel({ prefs, onChange, onClose, onDownloadMp3 }) {
  const panelRef = useRef(null);

  // Foco al abrir
  useEffect(() => { panelRef.current?.querySelector("button,input")?.focus(); }, []);

  // Cerrar con Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const item = (icon, label, id, val) => (
    <div className="rs-pref-row">
      <span className="rs-pref-icon" aria-hidden="true">{icon}</span>
      <span className="rs-pref-name">{label}</span>
      <Toggle id={id} checked={val} onChange={v => onChange(id, v)} label={label}/>
    </div>
  );

  return (
    <div className="rs-panel-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Preferencias de accesibilidad">
      <div className="rs-panel" ref={panelRef} onClick={e => e.stopPropagation()}>

        <div className="rs-panel-head">
          <span className="rs-panel-title">Preferencias</span>
          <button className="rs-panel-close" onClick={onClose} aria-label="Cerrar preferencias">
            <CloseIcon/>
          </button>
        </div>

        <div className="rs-panel-body">
          {item(<KeyboardIcon/>, "Modo teclado",               "keyboard",    prefs.keyboard)}
          {item(<ClickIcon/>,    "Clic y escuchar",             "clickListen", prefs.clickListen)}
          {item(<EyeIcon/>,      "Visibilidad de texto mejorada","textVis",    prefs.textVis)}
          {item(<FormIcon/>,     "Lectura de formularios",      "formRead",    prefs.formRead)}
          {item(<TextIcon/>,     "Modo texto",                  "textMode",    prefs.textMode)}
          {item(<MaskIcon/>,     "Máscara de página",           "pageMask",    prefs.pageMask)}

          <div className="rs-pref-divider"/>

          <button className="rs-pref-download" onClick={onDownloadMp3} aria-label="Descargar audio MP3 de la descripción">
            <DownloadIcon/> Descargar MP3
          </button>
        </div>

        <div className="rs-panel-foot">
          por <strong>INCLUGO</strong> · accesibilidad web
        </div>
      </div>
    </div>
  );
}

// ─── Máscara de página ────────────────────────────────────────────────────────
function PageMask() {
  const [y, setY] = useState(200);
  useEffect(() => {
    const h = (e) => setY(e.clientY);
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <div className="ed-page-mask" aria-hidden="true" style={{
      background: `linear-gradient(
        to bottom,
        rgba(0,0,0,.85) 0,
        rgba(0,0,0,.85) ${y - 40}px,
        transparent ${y - 40}px,
        transparent ${y + 60}px,
        rgba(0,0,0,.85) ${y + 60}px
      )`
    }}/>
  );
}

// ─── Descripción completa con resaltado multi-párrafo ────────────────────────
// Usa el mismo regex /\S+/g que el hook para que los índices coincidan siempre.
function HighlightedDesc({ text, wordIndex }) {
  if (!text) return null;

  // Dividir en párrafos preservando el offset global de palabras
  const paragraphs = text.split(/\n+/).filter(p => p.trim());
  const result = [];
  let globalWi = 0;   // contador global de palabras a través de todos los párrafos

  paragraphs.forEach((para, pi) => {
    const tokens = [];
    let last = 0;
    const re = /\S+/g;
    let m;

    while ((m = re.exec(para)) !== null) {
      // Espacio/puntuación antes de la palabra
      if (m.index > last) tokens.push({ type: "space", val: para.slice(last, m.index) });
      tokens.push({ type: "word", val: m[0], wi: globalWi++ });
      last = m.index + m[0].length;
    }
    if (last < para.length) tokens.push({ type: "space", val: para.slice(last) });

    result.push(
      <p key={pi} className="ed-desc-text" aria-live={pi === 0 ? "polite" : "off"}>
        {tokens.map((tok, ti) =>
          tok.type === "space"
            ? tok.val
            : (
              <span
                key={ti}
                data-wi={tok.wi}
                className={wordIndex === tok.wi ? "ed-word-hi" : ""}
              >
                {tok.val}
              </span>
            )
        )}
      </p>
    );
  });

  return <>{result}</>;
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function EventDetail({ ev, onBack }) {
  const [imgOk, setImgOk]       = useState(!!ev.image);
  const [fontSize, setFontSize] = useState(1);
  const [hiContrast, setHiContrast] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [showPrefs, setShowPrefs] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [prefs, setPrefs] = useState({
    keyboard:    false,
    clickListen: false,
    textVis:     false,
    formRead:    false,
    textMode:    false,
    pageMask:    false,
  });

  const fallbackBg = CAT_COLORS[ev.cat] || "#111111";
  // Solo leemos la descripción — así el resaltado palabra a palabra
  // coincide exactamente con los spans del DOM
  const speechText = ev.descFull || ev.title || "";
  const { supported, status, wordIndex, words, play, pause, stop, skipBack, skipFwd } = useSpeech(speechText, speechRate);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  // Clic y escuchar — click en cualquier párrafo lo lee
  useEffect(() => {
    if (!prefs.clickListen || !supported) return;
    const handler = (e) => {
      const el = e.target.closest("p,h1,h2,h3");
      if (!el) return;
      stop();
      const utt = new SpeechSynthesisUtterance(el.textContent);
      utt.lang = "es-ES"; utt.rate = speechRate;
      window.speechSynthesis.speak(utt);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [prefs.clickListen, supported, stop, speechRate]);

  const cycleFontSize = () => setFontSize(f => f === 1 ? 1.15 : f === 1.15 ? 1.3 : 1);
  const fontLabel = fontSize === 1 ? "A" : fontSize === 1.15 ? "A+" : "A++";

  const handleShare = async () => {
    const url = ev.url !== "#" ? ev.url : window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: ev.title, text: `${ev.title} — ${ev.date}`, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setShareMsg("¡Enlace copiado!");
      setTimeout(() => setShareMsg(""), 2500);
    }
  };

  const handleDownloadMp3 = () => {
    // Web Speech no permite exportar audio — informamos al usuario
    setShareMsg("Tu navegador no permite exportar audio. Usa un lector de pantalla externo.");
    setTimeout(() => setShareMsg(""), 4000);
    setShowPrefs(false);
  };

  const updatePref = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  // Clases de página según preferencias
  const pageClasses = [
    "ed-page",
    hiContrast     ? "ed-hi-contrast" : "",
    prefs.textMode ? "ed-text-mode"   : "",
    prefs.textVis  ? "ed-text-vis"    : "",
  ].filter(Boolean).join(" ");

  const pageStyle = {
    fontSize: `${fontSize}rem`,
    ...(hiContrast ? {
      "--ed-bg":       "#000",
      "--ed-text":     "#fff",
      "--ed-subtext":  "#ff0",
      "--ed-border":   "#fff",
      "--ed-card-bg":  "#111",
      "--ed-pill-bg":  "#222",
      "--ed-pill-text":"#ff0",
    } : {}),
  };

  return (
    <>
      <style>{css}</style>

      {prefs.pageMask && <PageMask/>}

      {showPrefs && (
        <PrefsPanel
          prefs={prefs}
          onChange={updatePref}
          onClose={() => setShowPrefs(false)}
          onDownloadMp3={handleDownloadMp3}
        />
      )}

      <main className={pageClasses} style={pageStyle} id="main-content">

        <a href="#ed-desc" className="ed-skip">Saltar al contenido</a>

        {/* ── Topbar ── */}
        <nav className="ed-topbar" aria-label="Navegación y herramientas de accesibilidad">
          <div className="ed-topbar-inner">

            <button className="ed-back-btn" onClick={onBack} aria-label="Volver al listado de eventos">
              <ArrowLeft/> Volver
            </button>

            {/* ── Barra estilo ReadSpeaker ── */}
            {supported && (
              <div className="rs-bar" role="toolbar" aria-label="Lector de voz">

                {/* Menú */}
                <button className="rs-btn rs-btn--menu" onClick={() => setShowPrefs(p => !p)} aria-label="Abrir preferencias" title="Preferencias">
                  <span className="rs-hamburger" aria-hidden="true">☰</span>
                </button>

                {/* Escuchar / Pausar */}
                <button
                  className={`rs-btn rs-btn--listen${status !== "idle" ? " rs-active" : ""}`}
                  onClick={status === "idle" ? play : pause}
                  aria-label={status === "playing" ? "Pausar lectura" : status === "paused" ? "Reanudar" : "Escuchar"}
                >
                  {status === "playing" ? <PauseIcon/> : <PlayIcon/>}
                  <span>{status === "playing" ? "Pausar" : status === "paused" ? "Reanudar" : "Escuchar"}</span>
                </button>

                {/* Stop */}
                {status !== "idle" && (
                  <button className="rs-btn" onClick={stop} aria-label="Detener lectura" title="Detener">
                    <StopIcon/>
                  </button>
                )}

                {/* Retroceder */}
                <button className="rs-btn" onClick={skipBack} aria-label="Retroceder" title="Retroceder">
                  <SkipBIcon/>
                </button>

                {/* Avanzar */}
                <button className="rs-btn" onClick={skipFwd} aria-label="Avanzar" title="Avanzar">
                  <SkipFIcon/>
                </button>

                {/* Volumen (decorativo — la API no expone volumen independiente) */}
                <button className="rs-btn" aria-label="Volumen" title="Volumen" onClick={() => {}}>
                  <VolumeIcon/>
                </button>

                {/* Info */}
                <button className="rs-btn" aria-label="Información" title="Información" onClick={() => setShowPrefs(true)}>
                  <InfoIcon/>
                </button>

                {/* Cerrar barra */}
                <button className="rs-btn rs-btn--close" onClick={stop} aria-label="Cerrar lector">
                  <CloseIcon/>
                </button>

              </div>
            )}

            {/* Herramientas adicionales */}
            <div className="ed-extra-tools" role="toolbar" aria-label="Herramientas de visualización">

              {/* Preferencias (si no hay speech) */}
              {!supported && (
                <button className={`ed-tool-btn${showPrefs ? " ed-active" : ""}`}
                  onClick={() => setShowPrefs(p => !p)} aria-label="Preferencias" title="Preferencias">
                  <SettingsIcon/>
                </button>
              )}

              {/* Tamaño texto */}
              <button
                className={`ed-tool-btn${fontSize > 1 ? " ed-active" : ""}`}
                onClick={cycleFontSize}
                aria-label={`Tamaño de texto: ${fontLabel}`}
                title="Tamaño de texto"
              >
                <span className="ed-font-label" aria-hidden="true">{fontLabel}</span>
              </button>

              {/* Alto contraste */}
              <button
                className={`ed-tool-btn${hiContrast ? " ed-active" : ""}`}
                onClick={() => setHiContrast(h => !h)}
                aria-pressed={hiContrast}
                aria-label="Alto contraste"
                title="Alto contraste"
              >
                <ContrastIcon/>
              </button>

              {/* Compartir */}
              <button className="ed-tool-btn" onClick={handleShare} aria-label="Compartir evento" title="Compartir">
                <ShareIcon/>
              </button>

            </div>

          </div>

          {/* Toast */}
          {shareMsg && (
            <div className="ed-toast" role="status" aria-live="polite">{shareMsg}</div>
          )}

          {/* Progreso de lectura */}
          {status !== "idle" && (
            <div className="ed-progress" role="progressbar"
              aria-valuenow={wordIndex} aria-valuemax={words.length} aria-label="Progreso de lectura">
              <div className="ed-progress-bar"
                style={{ width: `${Math.round((Math.max(0, wordIndex) / Math.max(1, words.length)) * 100)}%` }}/>
            </div>
          )}
        </nav>

        {/* ── Hero ── */}
        <div className="ed-hero" aria-hidden="true">
          {ev.image && imgOk
            ? <img src={ev.image} alt="" className="ed-hero-img" onError={() => setImgOk(false)}/>
            : <div className="ed-hero-fallback" style={{ background: fallbackBg }}><div className="ed-hero-pattern"/></div>
          }
          <div className="ed-hero-gradient"/>
        </div>

        {/* ── Contenido ── */}
        <div className="ed-content">
          <div className="ed-content-inner">

            {/* Columna principal */}
            <div className="ed-main-col">

              <div className="ed-title-block">
                <span className="ed-cat-label">{ev.cat}</span>
                <h1 className="ed-title">{ev.title}</h1>
                {ev.org && <p className="ed-org">{ev.org}</p>}
              </div>

              {ev.access.length > 0 && (
                <div className="ed-access-pills" role="list" aria-label="Accesibilidad">
                  {ev.access.map(a => {
                    const info = ACCESS_INFO[a];
                    if (!info) return null;
                    const Icon = { silla: WheelIcon, signos: SignosIcon, bucle: BucleIcon, braille: PodoIcon }[a];
                    return (
                      <span key={a} className="ed-pill" role="listitem">
                        {Icon && <Icon/>} {info.label}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Descripción */}
              <section id="ed-desc" className="ed-section" aria-labelledby="desc-h">
                <div className="ed-section-header">
                  <h2 className="ed-section-title" id="desc-h">Descripción del evento</h2>
                  {supported && (
                    <button
                      className={`ed-listen-inline${status !== "idle" ? " ed-active" : ""}`}
                      onClick={status === "idle" ? play : pause}
                      aria-label={status === "playing" ? "Pausar" : "Escuchar descripción"}
                    >
                      {status === "playing" ? <PauseIcon/> : <PlayIcon/>}
                      {status === "playing" ? "Pausar" : status === "paused" ? "Reanudar" : "Escuchar"}
                    </button>
                  )}
                </div>

                {ev.descFull ? (
                  <div className="ed-desc">
                    <HighlightedDesc
                      text={ev.descFull}
                      wordIndex={status !== "idle" ? wordIndex : -1}
                    />
                  </div>
                ) : (
                  <p className="ed-no-desc">El Ayuntamiento de Madrid no ha facilitado descripción para este evento.</p>
                )}
              </section>

              {/* Accesibilidad detallada */}
              {ev.access.length > 0 && (
                <section className="ed-section" aria-labelledby="acc-h">
                  <h2 className="ed-section-title" id="acc-h">Accesibilidad</h2>
                  <div className="ed-access-list">
                    {ev.access.map(a => {
                      const info = ACCESS_INFO[a];
                      if (!info) return null;
                      const Icon = { silla: WheelIcon, signos: SignosIcon, bucle: BucleIcon, braille: PodoIcon }[a];
                      return (
                        <div key={a} className="ed-access-row">
                          <span className="ed-access-icon" aria-hidden="true">{Icon && <Icon/>}</span>
                          <div>
                            <strong className="ed-access-name">{info.label}</strong>
                            <span className="ed-access-desc">{info.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

            </div>

            {/* Sidebar */}
            <aside className="ed-sidebar" aria-label="Información del evento">
              <div className="ed-sidebar-card">

                <div className="ed-sidebar-item">
                  <span className="ed-sidebar-icon" aria-hidden="true"><EuroIcon/></span>
                  <div>
                    <span className="ed-sidebar-label">Precio</span>
                    <span className={`ed-sidebar-value${ev.price === "Gratis" ? " ed-val-free" : ""}`}>{ev.price}</span>
                  </div>
                </div>
                <div className="ed-sidebar-divider"/>

                <div className="ed-sidebar-item">
                  <span className="ed-sidebar-icon" aria-hidden="true"><CalIcon/></span>
                  <div>
                    <span className="ed-sidebar-label">Fecha</span>
                    <span className="ed-sidebar-value">{ev.date}</span>
                    {ev.timeStr && <span className="ed-sidebar-sub">a las {ev.timeStr}</span>}
                  </div>
                </div>
                <div className="ed-sidebar-divider"/>

                <div className="ed-sidebar-item">
                  <span className="ed-sidebar-icon" aria-hidden="true"><PinIcon/></span>
                  <div>
                    <span className="ed-sidebar-label">Lugar</span>
                    <span className="ed-sidebar-value">{ev.venueRaw || ev.venue}</span>
                    <span className="ed-sidebar-sub">{ev.district} · Madrid</span>
                  </div>
                </div>
                <div className="ed-sidebar-divider"/>

                {ev.url && ev.url !== "#"
                  ? <a href={ev.url} target="_blank" rel="noreferrer" className="ed-cta">Ver en web oficial <ExternalIcon/></a>
                  : <span className="ed-cta-disabled">Más información próximamente</span>
                }

                <button className="ed-share-btn" onClick={handleShare} aria-label="Compartir este evento">
                  <ShareIcon/> Compartir evento
                </button>

              </div>

              <p className="ed-source-note">
                Datos:{" "}
                <a href="https://datos.madrid.es/portal/site/egob" target="_blank" rel="noreferrer" className="ed-source-link">
                  API Ayuntamiento de Madrid
                </a>
              </p>
            </aside>

          </div>
        </div>

      </main>
    </>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');

  .ed-page {
    --ed-bg:#fff; --ed-text:#111; --ed-subtext:#666;
    --ed-border:#ebebeb; --ed-card-bg:${P.cream};
    --ed-pill-bg:${P.cream}; --ed-pill-text:${P.navy};
    min-height:100vh; background:var(--ed-bg); color:var(--ed-text);
    font-family:'Inter',sans-serif; transition:font-size .2s;
    animation:ed-in .22s ease;
  }
  @keyframes ed-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  /* Máscara */
  .ed-page-mask {
    position:fixed; inset:0; pointer-events:none; z-index:9000;
    transition:background .05s;
  }

  /* Alto contraste */
  .ed-hi-contrast { background:#000!important; color:#fff!important; }
  .ed-hi-contrast .ed-topbar { background:#000!important; border-color:#fff!important; }
  .ed-hi-contrast .ed-back-btn { color:#fff!important; border-color:#fff!important; }
  .ed-hi-contrast .rs-bar { background:#111!important; border-color:#fff!important; }
  .ed-hi-contrast .rs-btn { color:#fff!important; border-color:#555!important; }
  .ed-hi-contrast .rs-btn--listen { background:#ff0!important; color:#000!important; }
  .ed-hi-contrast .ed-tool-btn { color:#fff!important; border-color:#555!important; }
  .ed-hi-contrast .ed-tool-btn.ed-active { background:#ff0!important; color:#000!important; border-color:#ff0!important; }
  .ed-hi-contrast .ed-title { color:#fff!important; }
  .ed-hi-contrast .ed-cat-label { background:#ff0!important; color:#000!important; }
  .ed-hi-contrast .ed-pill { background:#222!important; color:#ff0!important; border-color:#ff0!important; }
  .ed-hi-contrast .ed-section-title { color:#ff0!important; }
  .ed-hi-contrast .ed-desc-text { color:#fff!important; }
  .ed-hi-contrast .ed-word-hi { background:#ff0!important; color:#000!important; }
  .ed-hi-contrast .ed-sidebar-card { background:#111!important; border-color:#fff!important; }
  .ed-hi-contrast .ed-sidebar-value { color:#fff!important; }
  .ed-hi-contrast .ed-sidebar-label { color:#aaa!important; }
  .ed-hi-contrast .ed-cta { background:#ff0!important; color:#000!important; }
  .ed-hi-contrast .ed-access-icon { background:#ff0!important; color:#000!important; }
  .ed-hi-contrast .ed-access-name { color:#fff!important; }
  .ed-hi-contrast .ed-access-desc { color:#aaa!important; }

  /* Modo texto */
  .ed-text-mode .ed-hero { display:none!important; }
  .ed-text-mode .ed-sidebar-card { border:2px solid #111; }

  /* Visibilidad mejorada */
  .ed-text-vis .ed-desc-text { line-height:2.2!important; letter-spacing:.03em; }
  .ed-text-vis .ed-title { letter-spacing:.06em!important; }

  /* Skip link */
  .ed-skip {
    position:absolute; left:-9999px; top:auto; width:1px; height:1px; overflow:hidden;
    background:${P.yellow}; color:#111; font-weight:700; padding:.5rem 1rem;
    border-radius:0 0 4px 4px; z-index:9999; text-decoration:none;
  }
  .ed-skip:focus { position:fixed; left:50%; transform:translateX(-50%); top:0; width:auto; height:auto; }

  /* ── Topbar ── */
  .ed-topbar {
    position:sticky; top:0; z-index:200;
    background:#111; border-bottom:1px solid #222;
  }
  .ed-topbar-inner {
    max-width:1120px; margin:0 auto;
    padding:0 clamp(1rem,5vw,4rem);
    min-height:56px; display:flex; align-items:center;
    gap:.75rem; flex-wrap:wrap; padding-top:.5rem; padding-bottom:.5rem;
  }
  .ed-back-btn {
    display:inline-flex; align-items:center; gap:.45rem;
    background:transparent; border:1.5px solid #444; color:#ccc;
    font-family:'Inter',sans-serif; font-size:.8rem; font-weight:500;
    padding:.4rem .9rem; border-radius:4px; cursor:pointer; transition:all .15s;
    white-space:nowrap; flex-shrink:0;
  }
  .ed-back-btn:hover { background:#222; color:#fff; border-color:#666; }
  .ed-back-btn:focus-visible { outline:2px solid ${P.yellow}; outline-offset:2px; }

  /* ── Barra ReadSpeaker ── */
  .rs-bar {
    display:inline-flex; align-items:center; gap:1px;
    background:#1e1e1e; border:1.5px solid #444; border-radius:4px;
    overflow:hidden; flex-shrink:0;
  }
  .rs-btn {
    display:inline-flex; align-items:center; gap:.35rem;
    background:transparent; border:none; border-right:1px solid #333;
    color:#bbb; font-family:'Inter',sans-serif; font-size:.72rem; font-weight:600;
    padding:.42rem .65rem; cursor:pointer; transition:all .12s;
    min-height:36px; white-space:nowrap;
  }
  .rs-btn:last-child { border-right:none; }
  .rs-btn:hover { background:#2a2a2a; color:#fff; }
  .rs-btn:focus-visible { outline:2px solid ${P.yellow}; outline-offset:-2px; z-index:1; position:relative; }
  .rs-btn--listen {
    background:#1a3a6e; color:#fff; font-weight:700; padding:.42rem .9rem;
  }
  .rs-btn--listen.rs-active { background:${P.yellow}; color:#111; }
  .rs-btn--listen:hover { background:#254d96; }
  .rs-btn--menu { font-size:1rem; padding:.42rem .7rem; }
  .rs-btn--close { color:#666; }
  .rs-hamburger { font-size:1rem; line-height:1; }

  /* Extra tools */
  .ed-extra-tools {
    display:inline-flex; align-items:center; gap:.3rem; margin-left:auto; flex-shrink:0;
  }
  .ed-tool-btn {
    display:inline-flex; align-items:center; gap:.35rem;
    background:transparent; border:1.5px solid #444; color:#aaa;
    font-family:'Inter',sans-serif; font-size:.72rem; font-weight:600;
    padding:.35rem .6rem; border-radius:4px; cursor:pointer;
    transition:all .15s; min-height:36px;
  }
  .ed-tool-btn:hover { background:#222; color:#fff; border-color:#666; }
  .ed-tool-btn.ed-active { background:${P.yellow}; color:#111; border-color:${P.yellow}; }
  .ed-tool-btn:focus-visible { outline:2px solid ${P.yellow}; outline-offset:2px; }
  .ed-font-label { font-size:.82rem; font-weight:800; font-family:'Bebas Neue',sans-serif; }

  /* Toast */
  .ed-toast {
    position:absolute; top:100%; left:50%; transform:translateX(-50%);
    background:${P.navy}; color:#fff; font-size:.8rem; font-weight:600;
    padding:.5rem 1.25rem; border-radius:100px; margin-top:.5rem;
    animation:ed-toast-in .2s ease; z-index:300; white-space:nowrap;
    max-width:90vw; text-align:center;
  }
  @keyframes ed-toast-in { from{opacity:0;transform:translateX(-50%) translateY(-6px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  /* Progreso lectura */
  .ed-progress { height:3px; background:#222; width:100%; }
  .ed-progress-bar { height:100%; background:${P.yellow}; transition:width .3s linear; }

  /* ── Panel preferencias ── */
  .rs-panel-backdrop {
    position:fixed; inset:0; background:rgba(0,0,0,.55);
    z-index:500; display:flex; align-items:flex-start;
    justify-content:center; padding-top:64px;
    animation:rs-fade .15s ease;
  }
  @keyframes rs-fade { from{opacity:0} to{opacity:1} }
  .rs-panel {
    background:#fff; border:1px solid #ddd; border-radius:8px;
    width:340px; max-width:95vw;
    box-shadow:0 8px 32px rgba(0,0,0,.18);
    animation:rs-slide .18s cubic-bezier(.22,1,.36,1);
    overflow:hidden;
  }
  @keyframes rs-slide { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
  .rs-panel-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:.875rem 1rem; border-bottom:1px solid #eee;
    background:#f9f9f9;
  }
  .rs-panel-title {
    font-family:'Inter',sans-serif; font-size:.88rem; font-weight:700; color:#111;
  }
  .rs-panel-close {
    background:transparent; border:none; color:#999; cursor:pointer;
    padding:.25rem; border-radius:4px; display:flex; align-items:center;
  }
  .rs-panel-close:hover { color:#111; }
  .rs-panel-close:focus-visible { outline:2px solid ${P.yellow}; }

  .rs-panel-body { padding:.5rem 0; }
  .rs-pref-row {
    display:flex; align-items:center; gap:.75rem;
    padding:.65rem 1rem; border-bottom:1px solid #f5f5f5;
    transition:background .1s;
  }
  .rs-pref-row:last-of-type { border-bottom:none; }
  .rs-pref-row:hover { background:#fafafa; }
  .rs-pref-icon { color:#555; flex-shrink:0; display:flex; }
  .rs-pref-name {
    flex:1; font-family:'Inter',sans-serif; font-size:.82rem; color:#222;
  }

  /* Toggle switch */
  .rs-toggle { display:flex; align-items:center; cursor:pointer; flex-shrink:0; }
  .rs-toggle-label { display:none; } /* label ya está en rs-pref-name */
  .rs-toggle-track {
    position:relative; width:42px; height:24px;
    background:#ddd; border-radius:100px; transition:background .2s;
    flex-shrink:0;
  }
  .rs-toggle-input { opacity:0; width:0; height:0; position:absolute; }
  .rs-toggle-input:checked ~ .rs-toggle-thumb { transform:translateX(18px); }
  .rs-toggle-input:checked + .rs-toggle-track,
  .rs-toggle-track:has(.rs-toggle-input:checked) { background:${P.blue}; }
  .rs-toggle-thumb {
    position:absolute; top:3px; left:3px;
    width:18px; height:18px; border-radius:50%;
    background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.3);
    transition:transform .2s; pointer-events:none;
  }
  /* Fix: el thumb debe reaccionar al checked del input */
  .rs-toggle-input:checked ~ * .rs-toggle-thumb,
  .rs-toggle-track:has(input:checked) .rs-toggle-thumb { transform:translateX(18px); }
  .rs-toggle-track { display:flex; align-items:center; }

  .rs-pref-divider { height:1px; background:#eee; margin:.25rem 0; }
  .rs-pref-download {
    display:flex; align-items:center; gap:.6rem;
    width:100%; padding:.75rem 1rem;
    background:transparent; border:none; color:#333;
    font-family:'Inter',sans-serif; font-size:.82rem; font-weight:600;
    cursor:pointer; transition:background .12s; text-align:left;
  }
  .rs-pref-download:hover { background:#f5f5f5; }
  .rs-pref-download:focus-visible { outline:2px solid ${P.yellow}; }

  .rs-panel-foot {
    padding:.6rem 1rem; border-top:1px solid #eee;
    font-size:.68rem; color:#aaa; text-align:right;
    background:#fafafa;
  }

  /* ── Hero ── */
  .ed-hero {
    position:relative; width:100%; height:clamp(200px,35vw,400px);
    overflow:hidden; background:#111;
  }
  .ed-hero-img { width:100%; height:100%; object-fit:cover; display:block; }
  .ed-hero-fallback { width:100%; height:100%; }
  .ed-hero-pattern {
    width:100%; height:100%;
    background-image:repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.04) 20px,rgba(255,255,255,.04) 21px);
  }
  .ed-hero-gradient { position:absolute; inset:0; background:linear-gradient(to bottom,transparent 40%,rgba(17,17,17,.55) 100%); }

  /* ── Layout ── */
  .ed-content { background:var(--ed-bg); }
  .ed-content-inner {
    max-width:1120px; margin:0 auto;
    padding:clamp(2rem,5vw,3.5rem) clamp(1rem,5vw,4rem) clamp(3rem,6vw,5rem);
    display:grid; grid-template-columns:1fr 320px; gap:3.5rem; align-items:start;
  }
  @media (max-width:860px) {
    .ed-content-inner { grid-template-columns:1fr; gap:2rem; }
    .ed-sidebar { order:-1; }
  }

  .ed-title-block { margin-bottom:1.5rem; }
  .ed-cat-label {
    display:inline-block; font-size:.65rem; font-weight:800;
    letter-spacing:.14em; text-transform:uppercase;
    color:var(--ed-pill-text); background:var(--ed-pill-bg);
    border:1.5px solid #E0DED4; padding:.28rem .7rem;
    border-radius:2px; margin-bottom:.75rem;
  }
  .ed-title {
    font-family:'Bebas Neue',sans-serif; font-weight:400;
    font-size:clamp(2.2rem,6vw,3.8rem); letter-spacing:.04em;
    color:var(--ed-text); line-height:1.05; margin:0 0 .5rem;
  }
  .ed-org { font-size:.85rem; color:var(--ed-subtext); margin:0; font-style:italic; }

  .ed-access-pills { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:2rem; }
  .ed-pill {
    display:inline-flex; align-items:center; gap:.4rem;
    background:var(--ed-pill-bg); border:1.5px solid #E0DED4;
    color:var(--ed-pill-text); font-size:.75rem; font-weight:600;
    padding:.35rem .85rem; border-radius:100px;
  }

  .ed-section { margin-bottom:2.5rem; padding-bottom:2.5rem; border-bottom:1px solid var(--ed-border); }
  .ed-section:last-of-type { border-bottom:none; }
  .ed-section-header { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap; }
  .ed-section-title { font-family:'Bebas Neue',sans-serif; font-weight:400; font-size:1.5rem; letter-spacing:.06em; color:var(--ed-text); margin:0; text-transform:uppercase; }

  .ed-listen-inline {
    display:inline-flex; align-items:center; gap:.4rem;
    background:transparent; border:1.5px solid #CCCAC0; color:#555;
    font-family:'Inter',sans-serif; font-size:.75rem; font-weight:600;
    padding:.35rem .85rem; border-radius:100px; cursor:pointer; transition:all .15s;
  }
  .ed-listen-inline:hover { background:${P.navy}; color:#fff; border-color:${P.navy}; }
  .ed-listen-inline.ed-active { background:${P.yellow}; color:#111; border-color:${P.yellow}; }
  .ed-listen-inline:focus-visible { outline:2px solid ${P.yellow}; outline-offset:2px; }

  .ed-desc { font-size:1em; line-height:1.75; color:var(--ed-text); }
  .ed-desc-text { margin:0 0 1rem; color:var(--ed-text); line-height:1.75; }
  .ed-desc-text:last-child { margin-bottom:0; }
  .ed-no-desc { font-size:.88rem; color:var(--ed-subtext); font-style:italic; }

  .ed-word-hi { background:${P.yellow}; color:#111; border-radius:2px; padding:0 2px; transition:background .1s; }

  .ed-access-list { display:flex; flex-direction:column; gap:1.25rem; }
  .ed-access-row { display:flex; align-items:flex-start; gap:1rem; }
  .ed-access-icon {
    width:40px; height:40px; border-radius:10px;
    background:${P.navy}; color:#fff;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .ed-access-name { display:block; font-size:.88rem; font-weight:700; color:var(--ed-text); margin-bottom:.2rem; }
  .ed-access-desc { display:block; font-size:.82rem; color:var(--ed-subtext); line-height:1.5; }

  .ed-sidebar-card {
    background:var(--ed-card-bg); border:1.5px solid #E0DED4;
    border-radius:8px; padding:1.5rem; position:sticky; top:72px;
  }
  .ed-sidebar-item { display:flex; align-items:flex-start; gap:.875rem; }
  .ed-sidebar-icon {
    width:36px; height:36px; border-radius:8px; background:#fff;
    border:1px solid #E0DED4; color:${P.navy};
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .ed-sidebar-label { display:block; font-size:.63rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#999; margin-bottom:.2rem; }
  .ed-sidebar-value { display:block; font-size:.92rem; font-weight:700; color:var(--ed-text); line-height:1.35; }
  .ed-val-free { color:${P.blue}; }
  .ed-sidebar-sub { display:block; font-size:.78rem; color:var(--ed-subtext); margin-top:.15rem; }
  .ed-sidebar-divider { height:1px; background:#E0DED4; margin:1.25rem 0; }

  .ed-cta {
    display:flex; align-items:center; justify-content:center; gap:.5rem;
    background:${P.navy}; color:#fff; font-size:.85rem; font-weight:700;
    letter-spacing:.04em; padding:.9rem 1.5rem; border-radius:4px;
    text-decoration:none; transition:background .15s; width:100%;
    text-align:center; margin-top:.25rem;
  }
  .ed-cta:hover { background:${P.blue}; }
  .ed-cta:focus-visible { outline:2px solid ${P.yellow}; outline-offset:2px; }
  .ed-cta-disabled { display:block; text-align:center; font-size:.8rem; color:#999; padding:.9rem; border:1px dashed #ccc; border-radius:4px; margin-top:.25rem; }

  .ed-share-btn {
    display:flex; align-items:center; justify-content:center; gap:.5rem;
    width:100%; margin-top:.75rem; background:transparent;
    border:1.5px solid #CCCAC0; color:#555; font-family:'Inter',sans-serif;
    font-size:.82rem; font-weight:600; padding:.7rem; border-radius:4px;
    cursor:pointer; transition:all .15s;
  }
  .ed-share-btn:hover { background:#f5f5f5; color:#111; }
  .ed-share-btn:focus-visible { outline:2px solid ${P.yellow}; outline-offset:2px; }

  .ed-source-note { font-size:.72rem; color:#999; text-align:center; margin-top:.875rem; line-height:1.5; }
  .ed-source-link { color:${P.blue}; text-decoration:none; }
  .ed-source-link:hover { text-decoration:underline; }

  @media (max-width:640px) {
    .rs-bar .rs-btn:not(.rs-btn--listen):not(.rs-btn--menu) { display:none; }
    .ed-extra-tools .ed-tool-btn { padding:.3rem .45rem; }
  }
`;