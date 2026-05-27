import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useAccessibility } from "./AccessibilityContext";
import { WheelIcon as WheelIconShared, HandsIcon, BucleIcon as BucleIconShared, PodoIcon as PodoIconShared } from "./AccessibilityIcons";

const P = {
  brand:       "#3D47C8",
  brandHover:  "#2f39a8",
  brandLight:  "#a0a8f5",
  brandSubtle: "#eef0fe",
  cream:       "#F2F0E6",
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
  silla:  { label: "Silla de ruedas",   desc: "Espacio adaptado para personas usuarias de silla de ruedas.", requestable: false },
  signos: { label: "Lenguaje de signos",desc: "Interpretación en Lengua de Signos Española (LSE).", requestable: true },
  bucle:  { label: "Bucle magnético",   desc: "Disponible para personas con prótesis auditivas.", requestable: true },
  podo:   { label: "Podotáctil",        desc: "Pavimento táctil para orientación de personas con discapacidad visual.", requestable: false },
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
const ShareIcon  = () => <Ico d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>}/>
const HeartIcon  = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);;
const WheelIcon  = () => <WheelIconShared  size={16}/>;
const SignosIcon = () => <HandsIcon        size={16}/>;
const BucleIcon  = () => <BucleIconShared  size={16}/>;
const PodoIcon   = () => <PodoIconShared   size={16}/>;
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
          {item(<MaskIcon/>,     "Máscara de página",           "pageMask",    prefs.pageMask)}

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
  const { user, favIds, addFav, removeFav } = useAuth();
  const imgSrc = ev.image || "/img/eventos/image.png";
  const [imgOk, setImgOk]       = useState(true);
  const descShort = ev.descShort || (ev.descFull ? ev.descFull.slice(0, 220).trimEnd() + (ev.descFull.length > 220 ? "…" : "") : "");
  const [fontSize, setFontSize] = useState(1);
  const [hiContrast, setHiContrast] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [showPrefs, setShowPrefs] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);
  const { prefs: globalPrefs, updatePref: updateGlobalPref } = useAccessibility();
  const [localPrefs, setLocalPrefs] = useState({ textMode: false });
  const prefs = { ...globalPrefs, ...localPrefs };
  const setPrefs = (fn) => {
    const next = typeof fn === "function" ? fn(prefs) : fn;
    const { textMode, ...globals } = next;
    Object.entries(globals).forEach(([k, v]) => { if (globalPrefs[k] !== v) updateGlobalPref(k, v); });
    setLocalPrefs(p => ({ ...p, textMode: next.textMode ?? p.textMode }));
  };

  const fallbackBg = CAT_COLORS[ev.cat] || "#111111";
  // Solo leemos la descripción — así el resaltado palabra a palabra
  // coincide exactamente con los spans del DOM
  const speechText = ev.descFull || ev.title || "";
  const { supported, status, wordIndex, words, play, pause, stop, skipBack, skipFwd } = useSpeech(speechText, speechRate);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const isFav = favIds.has(String(ev.id));
  const toggleFav = () => isFav ? removeFav(ev.id) : addFav(ev);

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

  // Construir texto del resumen "¿Qué encontrarás?"
  const highlights = ev.highlights || [];

  // Información adicional del sidebar
  const additionalInfo = [
    ev.price && ev.price !== "Ver precio" ? { icon: <EuroIcon/>, text: `Entrada general: ${ev.price}` } : null,
    ev.ageMin ? { icon: <Ico d={<><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>}/>, text: `A partir de ${ev.ageMin} años` } : null,
    ev.ticketNote ? { icon: <Ico d={<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0v2"/></>}/>, text: ev.ticketNote } : null,
    ev.familyFriendly ? { icon: <Ico d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}/>, text: "Espectáculo familiar" } : null,
    ev.limitedCapacity ? { icon: <Ico d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>, text: "Aforo limitado" } : null,
  ].filter(Boolean);

  return (
    <>
      <style>{css}</style>

      {prefs.pageMask && <PageMask/>}


      <main className={pageClasses} style={pageStyle} id="main-content">

        <a href="#ed-desc" className="ed-skip">Saltar al contenido</a>

        {/* ── Topbar: navegación + controles accesibilidad ── */}
        <nav className="ed-topbar">
          <div className="ed-topbar-inner">
            <button className="ed-back-btn" onClick={onBack} aria-label="Volver a eventos">
              <ArrowLeft/> Volver a eventos
            </button>
            <div className="ed-topbar-actions">
              {user && (
                <button className={`ed-icon-btn${isFav ? " ed-fav-on" : ""}`} onClick={toggleFav}
                  aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}>
                  <HeartIcon filled={isFav}/>
                </button>
              )}
              <button className="ed-icon-btn" onClick={handleShare} aria-label="Compartir evento">
                <ShareIcon/>
              </button>
              {supported && (
                <>
                  <div className="ed-topbar-sep"/>
                  <button className="ed-icon-btn" onClick={skipBack} aria-label="Retroceder"><SkipBIcon/></button>
                  <button className={`ed-icon-btn ed-icon-btn--play${status !== "idle" ? " ed-active" : ""}`}
                    onClick={status === "idle" ? play : (status === "playing" ? pause : play)}
                    aria-label={status === "playing" ? "Pausar" : "Escuchar"}>
                    {status === "playing" ? <PauseIcon/> : <PlayIcon/>}
                  </button>
                  <button className="ed-icon-btn" onClick={skipFwd} aria-label="Avanzar"><SkipFIcon/></button>
                  <div className="ed-topbar-sep"/>
                </>
              )}
              <button className={`ed-icon-btn ed-icon-btn--text${fontSize > 1 ? " ed-active" : ""}`}
                onClick={cycleFontSize} aria-label={`Tamaño de texto: ${fontLabel}`}>
                <span className="ed-font-label">{fontLabel}</span>
              </button>

              <button className="ed-icon-btn ed-icon-btn--close" onClick={onBack} aria-label="Cerrar">
                <CloseIcon/>
              </button>
            </div>
          </div>
          {shareMsg && <div className="ed-toast" role="status" aria-live="polite">{shareMsg}</div>}
          {status !== "idle" && (
            <div className="ed-progress" role="progressbar"
              aria-valuenow={wordIndex} aria-valuemax={words.length} aria-label="Progreso de lectura">
              <div className="ed-progress-bar"
                style={{ width: `${Math.round((Math.max(0, wordIndex) / Math.max(1, words.length)) * 100)}%` }}/>
            </div>
          )}
        </nav>

        {/* ── Contenido ── */}
        <div className="ed-content">
          <div className="ed-content-inner">

            {/* Título y categoría — fila completa encima del grid */}
            <div className="ed-title-block">
              <span className="ed-cat-label">{ev.cat}</span>
              <h1 className="ed-title">{ev.title}</h1>

            </div>

            {/* Columna principal */}
            <div className="ed-main-col">

              {/* Metadatos en fila */}
              <div className="ed-meta-row">
                {ev.date && (
                  <div className="ed-meta-item">
                    <CalIcon/>
                    <div>
                      <span className="ed-meta-label">Fecha</span>
                      <span className="ed-meta-sub">{ev.date}{ev.timeStr && <> · {ev.timeStr}</>}</span>
                    </div>
                  </div>
                )}
                {ev.duration && (
                  <div className="ed-meta-item">
                    <Ico d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>
                    <div>
                      <span className="ed-meta-label">Duración</span>
                      <span className="ed-meta-sub">{ev.duration}</span>
                    </div>
                  </div>
                )}
                {ev.ageMin && (
                  <div className="ed-meta-item">
                    <Ico d={<><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>}/>
                    <div>
                      <span className="ed-meta-label">Edad recomendada</span>
                      <span className="ed-meta-sub">A partir de {ev.ageMin}</span>
                    </div>
                  </div>
                )}
                {ev.price && (
                  <div className="ed-meta-item">
                    <EuroIcon/>
                    <div>
                      <span className="ed-meta-label">Entrada general</span>
                      <span className="ed-meta-sub">{ev.price}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Imagen + descripción lado a lado */}
              {(imgOk || ev.descFull || ev.trailerUrl) && (
                <div className="ed-show-block" id="ed-desc">
                  {imgOk && (
                    <div className="ed-show-img-wrap">
                      <img src={imgSrc} alt={ev.title} className="ed-show-img" onError={() => setImgOk(false)}/>
                    </div>
                  )}
                  <div className="ed-show-info">
                    <div className="ed-show-info-header">
                      <Ico d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>} size={16}/>
                      <span className="ed-show-info-title">SOBRE EL ESPECTÁCULO</span>
                      {supported && (
                        <button
                          className={`ed-listen-inline${status !== "idle" ? " ed-active" : ""}`}
                          onClick={status === "idle" ? play : pause}
                          aria-label={status === "playing" ? "Pausar" : "Escuchar descripción"}
                          style={{marginLeft:"auto"}}
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
                    {ev.trailerUrl && (
                      <a href={ev.trailerUrl} target="_blank" rel="noreferrer" className="ed-trailer-btn">
                        <PlayIcon/> Ver tráiler
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* ¿Qué encontrarás? */}
              {highlights.length > 0 && (
                <section className="ed-section" aria-labelledby="hi-h">
                  <h2 className="ed-section-title" id="hi-h">¿QUÉ ENCONTRARÁS?</h2>
                  <ul className="ed-highlights-list">
                    {highlights.map((h, i) => (
                      <li key={i} className="ed-highlight-item">
                        <span className="ed-highlight-icon" aria-hidden="true">
                          <Ico d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" size={14}/>
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Accesibilidad detallada */}
              {ev.access.length > 0 && (
                <section className="ed-section" aria-labelledby="acc-h">
                  <h2 className="ed-section-title" id="acc-h">Accesibilidad</h2>
                  <div className="ed-access-grid">
                    {ev.access.map(a => {
                      const info = ACCESS_INFO[a];
                      if (!info) return null;
                      const Icon = { silla: WheelIcon, signos: SignosIcon, bucle: BucleIcon, podo: PodoIcon }[a];
                      return (
                        <div key={a} className="ed-access-card">
                          <span className="ed-access-icon" aria-hidden="true">{Icon && <Icon/>}</span>
                          <div className="ed-access-body">
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

                <h2 className="ed-sidebar-heading" style={{textTransform:"uppercase"}}>Ubicación</h2>
                <div className="ed-sidebar-heading-bar"/>

                {/* Nombre del recinto */}
                {(ev.org || ev.venue) && (
                  <div className="ed-sidebar-item">
                    <span className="ed-sidebar-icon" aria-hidden="true"><PinIcon/></span>
                    <div>
                      <span className="ed-sidebar-label">Nombre</span>
                      <span className="ed-sidebar-value">{ev.org || ev.venue}</span>
                    </div>
                  </div>
                )}
                <div className="ed-sidebar-divider"/>

                {/* Dirección */}
                <div className="ed-sidebar-item">
                  <span className="ed-sidebar-icon" aria-hidden="true"><PinIcon/></span>
                  <div>
                    <span className="ed-sidebar-label">Dirección</span>
                    <span className="ed-sidebar-value">{ev.venueRaw || ev.venue}</span>
                    <span className="ed-sidebar-sub">{ev.district}, Madrid</span>
                    <div className="ed-map-embed">
                      <iframe
                        title="Mapa del evento"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent((ev.venueRaw || ev.venue) + ', Madrid')}&output=embed&z=15`}
                        width="100%" height="180" style={{border:0, display:"block"}}
                        allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent((ev.venueRaw || ev.venue) + ', Madrid')}`}
                      target="_blank" rel="noreferrer" className="ed-map-link">
                      Ver mapa <ExternalIcon/>
                    </a>
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


            </aside>

          </div>
        </div>

      </main>
    </>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

  .ed-page {
    --ed-bg:#fff; --ed-text:#111827; --ed-subtext:#6b7280;
    --ed-border:#d8d8ee; --ed-card-bg:${P.cream};
    --ed-pill-bg:${P.brandSubtle}; --ed-pill-text:${P.brand};
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
  .ed-hi-contrast .ed-toolbar-bar { background:#000!important; border-color:#fff!important; }
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
    background:${P.brandSubtle}; color:${P.brand}; font-weight:700; padding:.5rem 1rem;
    border-radius:0; z-index:9999; text-decoration:none;
  }
  .ed-skip:focus { position:fixed; left:50%; transform:translateX(-50%); top:0; width:auto; height:auto; }

  /* ── Iconos en topbar ── */
  .ed-icon-btn {
    display:inline-flex; align-items:center; justify-content:center;
    width:32px; height:32px; border-radius:0;
    background:transparent; border:1px solid #e5e7eb; color:#6b7280;
    cursor:pointer; transition:all .15s; flex-shrink:0;
  }
  .ed-icon-btn:hover { background:#f3f4f6; color:#111827; border-color:#d1d5db; }
  .ed-icon-btn.ed-active { background:${P.brandSubtle}; color:${P.brand}; border-color:${P.brand}; }
  .ed-icon-btn.ed-fav-on { color:#e74c3c; border-color:#fca5a5; background:#fff1f2; }
  .ed-icon-btn--play { background:${P.brand}; color:#fff; border-color:${P.brand}; width:34px; height:34px; }
  .ed-icon-btn--play:hover { background:${P.brandHover}; }
  .ed-icon-btn--play.ed-active { background:${P.brandHover}; }
  .ed-icon-btn--text { width:auto; padding:0 .5rem; font-family:'Inter',sans-serif; }
  .ed-icon-btn--close { color:#9ca3af; border-color:transparent; }
  .ed-icon-btn--close:hover { background:#fee2e2; color:#dc2626; border-color:#fca5a5; }
  .ed-icon-btn:focus-visible { outline:2px solid ${P.brand}; outline-offset:2px; }
  .ed-topbar-sep { width:1px; height:20px; background:#e5e7eb; flex-shrink:0; }
  .ed-font-label { font-size:.78rem; font-weight:700; font-family:'Inter',sans-serif; }

  /* Toast */
  .ed-toast {
    position:absolute; top:100%; left:50%; transform:translateX(-50%);
    background:${P.brand}; color:#fff; font-size:.87rem; font-weight:600;
    padding:.5rem 1.25rem; border-radius:0; margin-top:.5rem;
    animation:ed-toast-in .2s ease; z-index:300; white-space:nowrap;
    max-width:90vw; text-align:center;
  }
  @keyframes ed-toast-in { from{opacity:0;transform:translateX(-50%) translateY(-6px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  /* Progreso lectura */
  .ed-progress { height:3px; background:#222; width:100%; }
  .ed-progress-bar { height:100%; background:${P.brand}; transition:width .3s linear; }

  /* ── Panel preferencias ── */
  .rs-panel-backdrop {
    position:fixed; inset:0; background:rgba(0,0,0,.55);
    z-index:500; display:flex; align-items:flex-start;
    justify-content:center; padding-top:64px;
    animation:rs-fade .15s ease;
  }
  @keyframes rs-fade { from{opacity:0} to{opacity:1} }
  .rs-panel {
    background:#fff; border:1px solid #ddd; border-radius:0;
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
    font-family:'Inter',sans-serif; font-size:.95rem; font-weight:700; color:#111;
  }
  .rs-panel-close {
    background:transparent; border:none; color:#999; cursor:pointer;
    padding:.25rem; border-radius:0; display:flex; align-items:center;
  }
  .rs-panel-close:hover { color:#111; }
  .rs-panel-close:focus-visible { outline:2px solid ${P.brand}; }

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
    flex:1; font-family:'Inter',sans-serif; font-size:.9rem; color:#222;
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
  .rs-toggle-track:has(.rs-toggle-input:checked) { background:${P.brand}; }
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
    font-family:'Inter',sans-serif; font-size:.9rem; font-weight:600;
    cursor:pointer; transition:background .12s; text-align:left;
  }
  .rs-pref-download:hover { background:#f5f5f5; }
  .rs-pref-download:focus-visible { outline:2px solid ${P.brand}; }

  .rs-panel-foot {
    padding:.6rem 1rem; border-top:1px solid #eee;
    font-size:.78rem; color:#aaa; text-align:right;
    background:#fafafa;
  }

  /* ── Topbar ── */
  .ed-topbar {
    background:#fff; border-bottom:1px solid #e5e7eb;
    position:sticky; top:0; z-index:200;
  }
  .ed-topbar-inner {
    max-width:1280px; margin:0 auto;
    padding:.5rem clamp(1.25rem,5vw,6rem);
    display:flex; align-items:center; justify-content:space-between;
    gap:1rem;
  }
  .ed-back-btn {
    display:inline-flex; align-items:center; gap:.4rem;
    background:transparent; border:none; color:#6b7280;
    font-family:'Inter',sans-serif; font-size:.9rem; font-weight:500;
    padding:.35rem 0; cursor:pointer; transition:color .15s; white-space:nowrap;
  }
  .ed-back-btn:hover { color:#111827; }
  .ed-back-btn:focus-visible { outline:2px solid ${P.brand}; outline-offset:2px; }
  .ed-topbar-actions { display:flex; align-items:center; gap:.35rem; flex-shrink:0; }

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
    max-width:1280px; margin:0 auto;
    padding:clamp(2rem,4vw,3rem) clamp(1.25rem,5vw,6rem) 2rem;
    display:grid; grid-template-columns:1fr 320px; gap:2.5rem; align-items:start;
  }
  @media (max-width:900px) {
    .ed-content-inner { grid-template-columns:1fr; gap:2rem; }
    .ed-sidebar { order:-1; }
  }

  /* ── Title block ── */
  .ed-title-block { grid-column:1 / -1; margin-bottom:1.25rem; }
  .ed-cat-label {
    display:inline-block; font-size:.75rem; font-weight:800;
    letter-spacing:.14em; text-transform:uppercase;
    color:var(--ed-pill-text); background:var(--ed-pill-bg);
    border:1.5px solid #E0DED4; padding:.28rem .7rem;
    border-radius:0; margin-bottom:.75rem;
  }
  .ed-title {
    font-family:'Inter',sans-serif; font-weight:800;
    font-size:clamp(1.6rem,4vw,2.6rem); letter-spacing:-.01em;
    color:var(--ed-text); line-height:1.15; margin:0 0 .75rem;
  }
  .ed-venue-row {
    display:flex; align-items:flex-start; gap:.5rem;
    color:var(--ed-subtext); margin-top:.25rem;
  }
  .ed-venue-row svg { flex-shrink:0; margin-top:2px; }
  .ed-venue-name { display:block; font-size:.9rem; font-weight:600; color:var(--ed-text); }
  .ed-venue-city { display:block; font-size:.87rem; color:var(--ed-subtext); margin-top:.1rem; }

  /* ── Meta row ── */
  .ed-meta-row {
    display:flex; flex-wrap:wrap; gap:0;
    border:1px solid #e5e7eb; border-radius:0;
    overflow:hidden; margin-bottom:2rem;
    background:#fff;
  }
  .ed-meta-item {
    display:flex; align-items:center; gap:.65rem;
    padding:.85rem 1.1rem; flex:1; min-width:0;
    border-right:1px solid #e5e7eb;
  }
  .ed-meta-item:last-child { border-right:none; }
  @media (max-width:640px) {
    .ed-meta-item { min-width:50%; border-bottom:1px solid #e5e7eb; }
    .ed-meta-item:nth-child(even) { border-right:none; }
    .ed-meta-item:nth-last-child(-n+2) { border-bottom:none; }
  }
  .ed-meta-item svg { color:${P.brand}; flex-shrink:0; }
  .ed-meta-label { display:block; font-size:.75rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#9ca3af; margin-bottom:.15rem; }
  .ed-meta-sub { display:block; font-size:.9rem; font-weight:600; color:var(--ed-text); line-height:1.3; }

  /* ── Show block (imagen + sobre el espectáculo) ── */
  .ed-show-block {
    display:grid; grid-template-columns:1fr 1fr; gap:0;
    border:1px solid #e5e7eb; border-radius:0;
    overflow:hidden; margin-bottom:2rem;
    box-shadow:0 1px 3px rgba(0,0,0,.05);
  }
  @media (max-width:640px) { .ed-show-block { grid-template-columns:1fr; } }
  .ed-show-img-wrap { overflow:hidden; min-height:240px; }
  .ed-show-img { width:100%; height:100%; object-fit:cover; display:block; }
  .ed-show-info {
    padding:1.5rem;
    background:#f9fafb;
    display:flex; flex-direction:column; gap:.75rem;
    overflow-y:auto; max-height:520px;
  }
  .ed-show-info-header {
    display:flex; align-items:center; gap:.5rem;
    color:${P.brand}; flex-wrap:wrap;
  }
  .ed-show-info-title {
    font-size:.78rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase;
    color:${P.brand};
  }
  .ed-show-desc {
    font-size:.88rem; line-height:1.7; color:var(--ed-text);
    margin:0; flex:1;
  }
  .ed-trailer-btn {
    display:inline-flex; align-items:center; gap:.45rem;
    background:#fff; border:1px solid #e5e7eb; color:#374151;
    font-family:'Inter',sans-serif; font-size:.78rem; font-weight:600;
    padding:.45rem .9rem; border-radius:0; text-transform:uppercase;
    text-decoration:none; transition:all .15s; align-self:flex-start;
  }
  .ed-trailer-btn:hover { background:${P.brand}; color:#fff; border-color:${P.brand}; }

  .ed-org { font-size:.85rem; color:var(--ed-subtext); margin:0; font-style:italic; }

  .ed-access-pills { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:2rem; }
  .ed-pill {
    display:inline-flex; align-items:center; gap:.4rem;
    background:var(--ed-pill-bg); border:1.5px solid #E0DED4;
    color:var(--ed-pill-text); font-size:.75rem; font-weight:600;
    padding:.35rem .85rem; border-radius:0;
  }

  /* ── Sections ── */
  .ed-section { margin-bottom:2.5rem; padding-bottom:2.5rem; border-bottom:1px solid var(--ed-border); }
  .ed-section:last-of-type { border-bottom:none; }
  .ed-section-header { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap; }
  .ed-section-title {
    font-family:'Bebas Neue',sans-serif; font-weight:400; font-size:1.2rem;
    letter-spacing:.08em; color:var(--ed-text); margin:0; text-transform:uppercase;
  }

  /* Desc grid */
  .ed-desc-grid {
    display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; align-items:start;
  }
  @media (max-width:700px) { .ed-desc-grid { grid-template-columns:1fr; } }

  /* ¿Qué encontrarás? */
  .ed-highlights-card {
    background:#fafaf8; border:1.5px solid #E0DED4;
    border-radius:0; padding:1.25rem;
  }
  .ed-highlights-title {
    font-family:'Bebas Neue',sans-serif; font-size:1rem; letter-spacing:.1em;
    color:var(--ed-text); margin:0 0 1rem; font-weight:400;
  }
  .ed-highlights-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:.6rem; }
  .ed-highlight-item {
    display:flex; align-items:center; gap:.6rem;
    font-size:.92rem; color:var(--ed-text);
  }
  .ed-highlight-icon {
    width:28px; height:28px; border-radius:0;
    background:#fff; border:1px solid #d8d8ee; color:${P.brand};
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }

  .ed-listen-inline {
    display:inline-flex; align-items:center; gap:.4rem;
    background:transparent; border:1.5px solid #CCCAC0; color:#555;
    font-family:'Inter',sans-serif; font-size:.82rem; font-weight:600;
    padding:.35rem .85rem; border-radius:0; cursor:pointer; transition:all .15s;
  }
  .ed-listen-inline:hover { background:${P.brand}; color:#fff; border-color:${P.brand}; }
  .ed-listen-inline.ed-active { background:${P.brandSubtle}; color:${P.brand}; border-color:${P.brand}; }
  .ed-listen-inline:focus-visible { outline:2px solid ${P.brand}; outline-offset:2px; }

  .ed-desc { font-size:1em; line-height:1.75; color:var(--ed-text); }
  .ed-desc-text { margin:0 0 1rem; color:var(--ed-text); line-height:1.75; }
  .ed-desc-text:last-child { margin-bottom:0; }
  .ed-no-desc { font-size:.88rem; color:var(--ed-subtext); font-style:italic; }

  .ed-word-hi { background:${P.brandSubtle}; color:${P.brand}; border-radius:2px; padding:0 2px; transition:background .1s; }

  /* ── Accesibilidad grid ── */
  .ed-access-grid {
    display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));
    gap:1rem; margin-bottom:1rem;
  }
  .ed-access-card {
    border:1px solid #e5e7eb; border-radius:0;
    padding:1rem; display:flex; flex-direction:column; gap:.6rem;
    background:#fff;
  }
  .ed-access-icon {
    width:36px; height:36px; border-radius:0;
    background:${P.brandSubtle}; color:${P.brand};
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .ed-access-body { display:flex; flex-direction:column; gap:.25rem; }
  .ed-access-name { display:block; font-size:.95rem; font-weight:700; color:var(--ed-text); }
  .ed-access-desc { display:block; font-size:.87rem; color:var(--ed-subtext); line-height:1.5; }
  .ed-access-link {
    display:inline-flex; align-items:center; gap:.3rem;
    font-size:.85rem; font-weight:600; color:${P.brand};
    text-decoration:none; margin-top:.25rem;
  }
  .ed-access-link:hover { text-decoration:underline; }
  .ed-access-note {
    display:flex; align-items:center; gap:.5rem;
    font-size:.85rem; color:var(--ed-subtext);
    margin:0; padding-top:.5rem;
  }

  /* ── Sidebar ── */
  .ed-sidebar-card {
    background:var(--brand-subtle,#eef0fe); border:1px solid #e5e7eb;
    border-radius:0; padding:1.5rem; position:sticky; top:60px;
    box-shadow:0 1px 4px rgba(0,0,0,.06);
  }
  .ed-sidebar-heading {
    font-family:'Inter',sans-serif; font-weight:700;
    font-size:1.15rem; letter-spacing:-.01em;
    color:var(--ed-text); margin:0 0 .25rem;
  }
  .ed-sidebar-heading-bar {
    width:2rem; height:2px; background:${P.brand}; border-radius:2px; margin-bottom:1.25rem;
  }
  .ed-sidebar-item { display:flex; align-items:flex-start; gap:.75rem; }
  .ed-sidebar-icon {
    width:32px; height:32px; border-radius:0; background:${P.brandSubtle};
    color:${P.brand};
    display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem;
  }
  .ed-sidebar-label { display:block; font-size:.75rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#9ca3af; margin-bottom:.2rem; }
  .ed-sidebar-value { display:block; font-size:.95rem; font-weight:600; color:var(--ed-text); line-height:1.35; }
  .ed-val-free { color:#16a34a; }
  .ed-sidebar-sub { display:block; font-size:.85rem; color:var(--ed-subtext); margin-top:.1rem; }
  .ed-sidebar-divider { height:1px; background:#f3f4f6; margin:1rem 0; }
  .ed-map-link {
    display:inline-flex; align-items:center; gap:.3rem;
    font-size:.75rem; font-weight:600; color:${P.brand};
    background:none; border:none; cursor:pointer; padding:0; margin-top:.3rem;
  }
  .ed-map-link:hover { text-decoration:underline; }
  .ed-map-embed {
    margin-top:.75rem; border-radius:0; overflow:hidden;
    border:1px solid #e5e7eb;
    animation:ed-in .2s ease;
  }

  .ed-cta {
    display:flex; align-items:center; justify-content:center; gap:.5rem;
    background:${P.brand}; color:#fff; font-size:.9rem; font-weight:600;
    padding:.8rem 1.5rem; border-radius:0; text-transform:uppercase;
    text-decoration:none; transition:background .15s; width:100%;
    text-align:center; margin-top:.5rem;
  }
  .ed-cta:hover { background:${P.brandHover}; }
  .ed-cta:focus-visible { outline:2px solid ${P.brand}; outline-offset:2px; }
  .ed-cta-disabled { display:block; text-align:center; font-size:.87rem; color:#9ca3af; padding:.8rem; border:1px dashed #e5e7eb; border-radius:0; margin-top:.5rem; }

  .ed-share-btn {
    display:flex; align-items:center; justify-content:center; gap:.5rem;
    width:100%; margin-top:.5rem; background:transparent;
    border:1px solid #e5e7eb; color:#6b7280; font-family:'Inter',sans-serif;
    font-size:.9rem; font-weight:600; padding:.7rem; border-radius:0;
    cursor:pointer; transition:all .15s;
  }
  .ed-share-btn:hover { background:#f9fafb; color:#111827; border-color:#d1d5db; }
  .ed-share-btn:focus-visible { outline:2px solid ${P.brand}; outline-offset:2px; }

  /* Información adicional */
  .ed-addinfo-title {
    font-size:.75rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
    color:#9ca3af; margin:1rem 0 .5rem;
  }
  .ed-addinfo-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:.5rem; }
  .ed-addinfo-item {
    display:flex; align-items:center; gap:.5rem;
    font-size:.9rem; color:var(--ed-text);
  }
  .ed-addinfo-icon { color:var(--ed-subtext); display:flex; flex-shrink:0; }

  /* Organismo */
  .ed-org-row { display:flex; flex-direction:column; gap:.2rem; }
  .ed-org-label { font-size:.75rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#9ca3af; }
  .ed-org-name { font-size:.9rem; font-weight:600; color:var(--ed-text); }

  .ed-source-note { font-size:.78rem; color:#9ca3af; text-align:center; margin-top:.875rem; line-height:1.5; }
  .ed-source-link { color:${P.brand}; text-decoration:none; }
  .ed-source-link:hover { text-decoration:underline; }

  @media (max-width:640px) {
    .ed-topbar-sep { display:none; }
    .ed-icon-btn--play ~ .ed-icon-btn:not(.ed-icon-btn--text):not(.ed-icon-btn--close) { display:none; }
  }
`;