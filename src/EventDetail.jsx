import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useAccessibility } from "./AccessibilityContext";
import { WheelIcon as WheelIconShared, HandsIcon, BucleIcon as BucleIconShared, PodoIcon as PodoIconShared } from "./AccessibilityIcons";
import { CAT_COLORS } from "./constants/categories";
import { ACCESS_INFO } from "./constants/accessibility";
import { useSpeech } from "./hooks/useSpeech";
import PrefsPanel from "./components/eventdetail/PrefsPanel";
import PageMask from "./components/eventdetail/PageMask";
import { HighlightedText, HighlightedDesc } from "./components/eventdetail/HighlightedText";
import { getFallbackImage } from "./utils/fallbackImages";
import { getFallbackDescription } from "./utils/fallbackDescriptions";
import "./EventDetail.css";

const P = {
  brand:       "#3D47C8",
  brandHover:  "#2f39a8",
  brandLight:  "#a0a8f5",
  brandSubtle: "#eef0fe",
  cream:       "#F2F0E6",
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
const A11yIcon    = () => <Ico size={22} d={<><circle cx="12" cy="4" r="2"/><path d="M12 6v6l3 3M12 6l-3 6M6 8h12"/></>}/>;
const KeyboardIcon=()=><Ico d={<><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></>}/>;
const ClickIcon  = ()=><Ico d={<><path d="M9 9l2 12 1.8-5.2L18 14z"/><path d="M9 9H3"/><path d="M9 9V3"/></>}/>;
const TextIcon   = ()=><Ico d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></>}/>;
const MaskIcon      = ()=><Ico d={<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M2 10h20" strokeDasharray="3 3"/></>}/>;
const GrayscaleIcon = ()=><Ico d={<><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor" stroke="none"/></>}/>;
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

// ─── Componente principal ─────────────────────────────────────────────────────
export default function EventDetail({ ev, onBack }) {
  const { user, favIds, addFav, removeFav } = useAuth();
  const local = getFallbackImage(ev.cat, ev.id);
  const [imgSrc, setImgSrc] = useState(ev.image || local);
  const [imgOk, setImgOk]   = useState(true);
  const handleImgError = () => {
    if (imgSrc !== local) setImgSrc(local);
    else setImgOk(false);
  };
  const resolvedDesc = getFallbackDescription(ev);
  const descShort = ev.descShort || (resolvedDesc ? resolvedDesc.slice(0, 220).trimEnd() + (resolvedDesc.length > 220 ? "…" : "") : "");
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
  const speechText = resolvedDesc || ev.title || "";
  const { supported, status, wordIndex, words, play, pause, stop, skipBack, skipFwd } = useSpeech(speechText, speechRate);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const isFav = favIds.has(String(ev.id));
  const toggleFav = () => isFav ? removeFav(ev.id) : addFav(ev);


  const cycleFontSize = () => setFontSize(f => f === 1 ? 1.15 : f === 1.15 ? 1.3 : 1);
  const fontLabel = fontSize === 1 ? "A" : fontSize === 1.15 ? "A+" : "A++";

  const handleShare = async () => {
    const url = `${window.location.origin}/evento/${ev.id}`;
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

      {prefs.pageMask && <PageMask/>}

      {showPrefs && (
        <PrefsPanel
          prefs={prefs}
          onChange={updatePref}
          onClose={() => setShowPrefs(false)}
        />
      )}

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

              <button
                className={`ed-icon-btn ed-icon-btn--settings${showPrefs ? " ed-active" : ""}`}
                onClick={() => setShowPrefs(o => !o)}
                aria-label="Preferencias de accesibilidad"
                aria-expanded={showPrefs}
              >
                <SettingsIcon/>
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
            <div className="ed-title-block reveal">
              <span className="ed-cat-label">{ev.cat}</span>
              <h1 className="ed-title" aria-label={`${ev.cat}: ${ev.title}`}>{ev.title}</h1>
            </div>

            {/* Columna principal */}
            <div className="ed-main-col">

              {/* Metadatos en fila */}
              <div className="ed-meta-row reveal">
                {ev.date && (
                  <div className="ed-meta-item"
                    aria-label={`Fecha: ${ev.date}${ev.timeStr ? `, ${ev.timeStr}` : ""}`}>
                    <CalIcon/>
                    <div>
                      <span className="ed-meta-label">Fecha</span>
                      <span className="ed-meta-sub">{ev.date}{ev.timeStr && <> · {ev.timeStr}</>}</span>
                    </div>
                  </div>
                )}
                {ev.duration && (
                  <div className="ed-meta-item" aria-label={`Duración: ${ev.duration}`}>
                    <Ico d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>
                    <div>
                      <span className="ed-meta-label">Duración</span>
                      <span className="ed-meta-sub">{ev.duration}</span>
                    </div>
                  </div>
                )}
                {ev.ageMin && (
                  <div className="ed-meta-item" aria-label={`Edad recomendada: a partir de ${ev.ageMin}`}>
                    <Ico d={<><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>}/>
                    <div>
                      <span className="ed-meta-label">Edad recomendada</span>
                      <span className="ed-meta-sub">A partir de {ev.ageMin}</span>
                    </div>
                  </div>
                )}
                {ev.price && (
                  <div className="ed-meta-item" aria-label={`Precio: ${ev.price === "Ver precio" ? "consultar en web oficial" : ev.price}`}>
                    <EuroIcon/>
                    <div>
                      <span className="ed-meta-label">Entrada general</span>
                      {ev.price === "Ver precio" && ev.url && ev.url !== "#"
                        ? <a href={ev.url} target="_blank" rel="noreferrer" className="ed-meta-sub ed-price-link">
                            Ver precio en web oficial <ExternalIcon/>
                          </a>
                        : <span className="ed-meta-sub">{ev.price === "Ver precio" ? "Consultar precio" : ev.price}</span>
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* Imagen + descripción lado a lado */}
              {(imgOk || resolvedDesc || ev.trailerUrl) && (
                <div className="ed-show-block reveal" id="ed-desc">
                  {imgOk && (
                    <div className="ed-show-img-wrap">
                      <img src={imgSrc} alt={ev.title} className="ed-show-img" onError={handleImgError}/>
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
                    <div className="ed-desc">
                      <HighlightedDesc
                        text={resolvedDesc}
                        wordIndex={status !== "idle" ? wordIndex : -1}
                      />
                    </div>
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
                <section className="ed-section reveal" aria-labelledby="hi-h">
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
                <section className="ed-section reveal" aria-labelledby="acc-h">
                  <h2 className="ed-section-title" id="acc-h">Accesibilidad</h2>
                  <div className="ed-access-grid">
                    {ev.access.map(a => {
                      const info = ACCESS_INFO[a];
                      if (!info) return null;
                      const Icon = { silla: WheelIcon, signos: SignosIcon, bucle: BucleIcon, podo: PodoIcon }[a];
                      return (
                        <div key={a} className="ed-access-card"
                          aria-label={`${info.label}: ${info.desc}`}>
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
              <div className="ed-sidebar-card reveal">

                {/* ── Mapa ── */}
                <div className="ed-map-block">
                  <div className="ed-map-header">
                    <span className="ed-map-header-label">UBICACIÓN</span>
                    <div className="ed-map-header-line"/>
                  </div>
                  <div className="ed-map-frame">
                    <iframe
                      title="Mapa del evento"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent((ev.venueRaw || ev.venue) + ', Madrid')}&output=embed&z=15`}
                      width="100%" height="220" style={{border:0, display:"block"}}
                      allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="ed-map-overlay-badge" aria-hidden="true">
                      <PinIcon/> Madrid
                    </div>
                  </div>
                  <div className="ed-map-info">
                    <div className="ed-map-venue-row">
                      <span className="ed-map-pin-icon" aria-hidden="true"><PinIcon/></span>
                      <div>
                        <span className="ed-map-venue-name">{ev.org || ev.venue}</span>
                        <span className="ed-map-venue-addr">{ev.venueRaw !== ev.org ? ev.venueRaw : ""}</span>
                        <span className="ed-map-venue-city">{ev.district}, Madrid</span>
                      </div>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent((ev.venueRaw || ev.venue) + ', Madrid')}`}
                      target="_blank" rel="noreferrer" className="ed-map-cta"
                      aria-label="Cómo llegar en Google Maps">
                      <ExternalIcon/> Cómo llegar
                    </a>
                  </div>
                </div>

                <div className="ed-sidebar-divider"/>

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