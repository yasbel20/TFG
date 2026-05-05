import { useState, useRef, useEffect } from "react";
import EventsGrid  from "./eventsgrid";
import EventsPage  from "./EventsPage";
import EventDetail from "./EventDetail";
import AgendaPage  from "./AgendaPage";
import { preloadUnsplashCategories } from "./useUnsplash";
import "./home.css";

preloadUnsplashCategories();

/* ══════════════════════════════════════════════════
   ICONOS
══════════════════════════════════════════════════ */
const WheelIcon   = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="5" r="2" fill="currentColor" stroke="none"/>
    <path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z" fill="currentColor" stroke="none"/>
    <path d="M6 16a6 6 0 1 0 12 0" strokeWidth="2"/>
  </svg>
);
const HandsIcon   = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M7 4v6L5 8V5a1 1 0 0 1 2 0v3l1.5.75V4a1 1 0 0 1 2 0v6.5L9 9V4zM13 10c0-1 .9-1.8 2-1.8s2 .8 2 1.8v5c0 2.5-1.8 4.3-4 4.3S9 17.5 9 15v-4.5l4 4V12z"/>
  </svg>
);
const AudioIcon   = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <circle cx="12" cy="12" r="7" fill="none"/>
    <circle cx="12" cy="12" r="11" fill="none" strokeOpacity=".35"/>
  </svg>
);
const SubIcon     = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <rect x="2" y="6" width="20" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="11" width="6" height="2" rx="1"/>
    <rect x="12" y="11" width="8" height="2" rx="1"/>
    <rect x="4" y="15" width="10" height="2" rx="1"/>
  </svg>
);
const LoopIcon    = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <rect x="2" y="9" width="3" height="6" rx="1"/>
    <rect x="19" y="9" width="3" height="6" rx="1"/>
    <path d="M5 10C5 7 7.5 5 12 5s7 2 7 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 14c0 3 2.5 5 7 5s7-2 7-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const BrailleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    {[6,11].map(x => [5,10,15].map(y => <circle key={`${x}${y}`} cx={x} cy={y} r="1.8"/>))}
    {[15,20].map(x => [5,10,15].map(y => <circle key={`r${x}${y}`} cx={x} cy={y} r="1.8"/>))}
  </svg>
);
const EasyIcon    = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="3" rx="1.5"/>
    <rect x="3" y="10.5" width="14" height="3" rx="1.5"/>
    <rect x="3" y="16" width="10" height="3" rx="1.5"/>
  </svg>
);
const SearchIcon  = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="7"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);
const ChevronDownIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const ArrowRightIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

/* ══════════════════════════════════════════════════
   DATOS ESTÁTICOS
══════════════════════════════════════════════════ */
const ACCESS_INFO = {
  silla:      { label: "Silla de ruedas",   Icon: WheelIcon   },
  signos:     { label: "Lengua de signos",  Icon: HandsIcon   },
  audio:      { label: "Audiodescripción",  Icon: AudioIcon   },
  subtitulos: { label: "Subtítulos",        Icon: SubIcon     },
  bucle:      { label: "Bucle magnético",   Icon: LoopIcon    },
  braille:    { label: "Braille",           Icon: BrailleIcon },
  lectura:    { label: "Lectura fácil",     Icon: EasyIcon    },
};

const ACCESS_CARDS = [
  { key: "silla",   desc: "Acceso en silla de ruedas, rampas, ascensores y plazas PMR reservadas."  },
  { key: "signos",  desc: "Intérpretes de lengua de signos certificados presentes en el evento."    },
  { key: "braille", desc: "Materiales y señalización táctil en braille en el recinto cultural."     },
  { key: "bucle",   desc: "Sistema de inducción magnética para audífonos e implantes cocleares."    },
];

const EVENT_CATS_ALL = ["Todos los eventos","Música","Teatro","Exposición","Cine","Danza","Cultura"];
const ACCESS_CATS    = ["Toda la accesibilidad","Silla de ruedas","Lengua de signos","Braille","Bucle magnético"];

// Secciones informativas tipo WAH
const INFO_FEATURES = [
  {
    icon: "🗺️",
    title: "Eventos cerca de ti",
    desc:  "Filtra por distrito y encuentra cultura accesible a menos de 30 minutos de casa.",
  },
  {
    icon: "🔔",
    title: "Siempre actualizado",
    desc:  "Datos en tiempo real desde la API oficial del Ayuntamiento de Madrid. Nunca información desactualizada.",
  },
  {
    icon: "♿",
    title: "8 filtros de accesibilidad",
    desc:  "PMR, lengua de signos, audiodescripción, bucle magnético, braille, lectura fácil y más.",
  },
  {
    icon: "🎟️",
    title: "Acceso directo a entradas",
    desc:  "Cada evento enlaza directamente con la web oficial del organizador para comprar entradas.",
  },
  {
    icon: "📅",
    title: "Vista de agenda semanal",
    desc:  "Consulta todos los eventos de la semana agrupados por día, como una cartelera de festival.",
  },
  {
    icon: "🔊",
    title: "Lector de voz integrado",
    desc:  "Cada página de evento incluye lectura en voz alta con resaltado de palabras en tiempo real.",
  },
];

const TYPE_CARDS = [
  {
    label: "MÚSICA",
    sub:   "Conciertos · Jazz · Flamenco · Clásica",
    desc:  "Desde grandes auditorios hasta espacios íntimos, todos con información de accesibilidad verificada.",
    cat:   "Música",
  },
  {
    label: "TEATRO",
    sub:   "Drama · Comedia · Danza · Ópera",
    desc:  "Teatro adaptado con intérpretes de LSE, audiodescripción y espacios sin barreras.",
    cat:   "Teatro",
  },
  {
    label: "EXPOSICIÓN",
    sub:   "Arte · Fotografía · Historia · Ciencia",
    desc:  "Museos y galerías con señalización en braille, audioguías y acceso PMR completo.",
    cat:   "Exposición",
  },
];

/* ══════════════════════════════════════════════════
   DROPDOWN COMPONENTES
══════════════════════════════════════════════════ */
function EventsDropdown({ onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="nav-dropdown-wrap" ref={ref}>
      <button className={`nav-link nav-link--arrow${open ? " active" : ""}`}
        onClick={() => setOpen(o => !o)} aria-expanded={open} aria-haspopup="listbox">
        Eventos <ChevronDownIcon/>
      </button>
      {open && (
        <div className="nav-dropdown" role="listbox">
          {EVENT_CATS_ALL.map(cat => (
            <button key={cat} className="nav-dropdown-item" role="option"
              onClick={() => { setOpen(false); onSelect(cat === "Todos los eventos" ? "Todos" : cat); }}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AccessibilityDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="nav-dropdown-wrap" ref={ref}>
      <button className={`nav-link nav-link--arrow${open ? " active" : ""}`}
        onClick={() => setOpen(o => !o)} aria-expanded={open} aria-haspopup="listbox">
        Accesibilidad <ChevronDownIcon/>
      </button>
      {open && (
        <div className="nav-dropdown" role="listbox">
          {ACCESS_CATS.map(cat => (
            <button key={cat} className="nav-dropdown-item" role="option" onClick={() => setOpen(false)}>
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MENÚ HAMBURGUESA FULLSCREEN (estilo WAH)
══════════════════════════════════════════════════ */
function FullscreenMenu({ open, onClose, onNavigate, onAgenda }) {
  // Bloquear scroll y gestionar foco
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.getElementById("fs-menu-first")?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const NAV_ITEMS = [
    { label: "EVENTOS",        action: () => { onNavigate("Todos"); onClose(); } },
    { label: "MÚSICA",         action: () => { onNavigate("Música"); onClose(); } },
    { label: "TEATRO",         action: () => { onNavigate("Teatro"); onClose(); } },
    { label: "EXPOSICIONES",   action: () => { onNavigate("Exposición"); onClose(); } },
    { label: "AGENDA",         action: () => { onAgenda(); onClose(); } },
    { label: "ACCESIBILIDAD",  action: () => { onClose(); } },
    { label: "ACERCA DE",      action: () => { onClose(); } },
  ];

  return (
    <div
      className={`fs-menu${open ? " fs-menu--open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menú principal"
    >
      {/* Botón cerrar */}
      <button className="fs-close" onClick={onClose} aria-label="Cerrar menú">
        <span aria-hidden="true">✕</span>
      </button>

      {/* Logo dentro del menú */}
      <p className="fs-logo" aria-hidden="true">INCLU<em>GO</em></p>

      {/* Ítems de navegación */}
      <nav aria-label="Menú de navegación">
        <ul className="fs-nav-list" role="list">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.label}>
              <button
                id={i === 0 ? "fs-menu-first" : undefined}
                className="fs-nav-item"
                onClick={item.action}
              >
                <span className="fs-nav-num" aria-hidden="true">0{i + 1}</span>
                {item.label}
                <span className="fs-nav-arrow" aria-hidden="true">›</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer del menú */}
      <div className="fs-footer">
        <p className="fs-footer-copy">TFG DAW · ILERNA Madrid · 2025/2026</p>
        <p className="fs-footer-copy">Datos: Ayuntamiento de Madrid</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════ */
export default function INCLUGOHome() {
  const [inputVal,      setInputVal]    = useState("");
  const [eventsPage,    setEventsPage]  = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAgenda,    setShowAgenda]  = useState(false);
  const [menuOpen,      setMenuOpen]    = useState(false);
  const evRef = useRef(null);

  // Ticker eliminado

  const scrollToEvents = () =>
    evRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleHint = (hint) => { setInputVal(hint); scrollToEvents(); };

  // Páginas secundarias
  if (selectedEvent) return <EventDetail ev={selectedEvent} onBack={() => setSelectedEvent(null)}/>;
  if (showAgenda)    return <AgendaPage  onBack={() => setShowAgenda(false)}/>;
  if (eventsPage !== null) return <EventsPage initialCategory={eventsPage} onBack={() => setEventsPage(null)}/>;

  return (
    <div className="ir">

      {/* Skip link WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>

      {/* ── Menú fullscreen ── */}
      <FullscreenMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={(cat) => setEventsPage(cat)}
        onAgenda={() => setShowAgenda(true)}
      />

      {/* ── NAV ── */}
      <header role="banner">
        <nav className="nav" aria-label="Navegación principal">
          <div className="nav-logo-group">
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
            >
              <span aria-hidden="true"/>
              <span aria-hidden="true"/>
              <span aria-hidden="true"/>
            </button>
            <button className="logo" onClick={scrollToEvents} aria-label="INCLUGO — ir al inicio">
              INCLU<em>GO</em>
            </button>
          </div>

          {/* Links escritorio */}
          <ul className="nav-links" role="list">
            <li><EventsDropdown onSelect={(cat) => setEventsPage(cat)}/></li>
            <li><AccessibilityDropdown/></li>
            <li>
              <button className="nav-link" onClick={() => setShowAgenda(true)}>Agenda</button>
            </li>
            <li><button className="nav-link">Acerca de</button></li>
          </ul>
        </nav>
      </header>

      {/* ── MAIN ── */}
      <main id="main-content">

        {/* ── HERO ── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-inner">
            <p className="hero-eyebrow" aria-hidden="true">Madrid · Cultura Accesible</p>
            <h1 id="hero-heading" className="hero-h1">
              CULTURA<br/>
              <span className="hl">SIN</span><br/>
              BARRERAS
            </h1>
            <p className="hero-sub">
              Descubre eventos culturales accesibles en Madrid. Filtra por tus necesidades
              y disfruta de la ciudad en igualdad de condiciones.
            </p>

            <div className="search-wrap" role="search">
              <div className="search-bar">
                <span className="search-icon-wrap" aria-hidden="true"><SearchIcon/></span>
                <label htmlFor="search-input" className="sr-only">Buscar evento, lugar o categoría</label>
                <input
                  id="search-input" className="search-input" type="search"
                  placeholder="Busca un evento, lugar o categoría..."
                  value={inputVal} onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && scrollToEvents()}
                  autoComplete="off"
                />
                <button className="search-btn" onClick={scrollToEvents} aria-label="Buscar eventos">
                  Buscar
                </button>
              </div>
              <div className="search-hint" aria-label="Búsquedas sugeridas">
                {[
                  { label: "Conciertos",   query: "concierto"  },
                  { label: "Teatro",       query: "teatro"     },
                  { label: "Exposiciones", query: "exposición" },
                  { label: "Gratis",       query: "gratis"     },
                ].map(({ label, query }) => (
                  <button key={query} className="search-hint-btn"
                    onClick={() => handleHint(query)} aria-label={`Buscar ${label}`}>
                    → {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>



        {/* ── STATS ── */}
        <section className="stats" aria-label="Cifras clave de INCLUGO">
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-num" aria-label="500.000">500<sup aria-hidden="true">K</sup></span>
              <span className="stat-label">Personas con discapacidad en Madrid</span>
            </div>
            <div className="stat">
              <span className="stat-num" aria-label="Más de 800">800<sup aria-hidden="true">+</sup></span>
              <span className="stat-label">Eventos culturales activos</span>
            </div>
            <div className="stat">
              <span className="stat-num">8</span>
              <span className="stat-label">Tipos de accesibilidad cubiertos</span>
            </div>
          </div>
        </section>

        {/* ── SHOWCASE: collage + lista de características ── */}
        <section className="showcase-sec" aria-labelledby="showcase-heading">
          <div className="showcase-inner">

            <div className="showcase-top">
              <h2 id="showcase-heading" className="showcase-heading">
                La plataforma de cultura accesible<br/>más completa de Madrid
              </h2>
            </div>

            <div className="showcase-body">
              {/* Collage de fotos */}
              <div className="showcase-collage" aria-hidden="true">
                {[
                  { q: "madrid concert music crowd",    r: 1 },
                  { q: "theater stage performance",     r: 2 },
                  { q: "madrid art exhibition gallery", r: 3 },
                  { q: "flamenco dance spain",          r: 4 },
                  { q: "jazz music live performance",   r: 5 },
                  { q: "madrid cultural festival",      r: 6 },
                ].map((img, i) => (
                  <div key={i} className={`collage-item collage-item--${i + 1}`}>
                    <img
                      src={`https://source.unsplash.com/random/400x300?${img.q}&sig=${img.r}`}
                      alt=""
                      loading="lazy"
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  </div>
                ))}
              </div>

              {/* Lista de características */}
              <ul className="showcase-list" aria-label="Características de INCLUGO">
                {[
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm4 12H8v-1c0-2.67 5.33-4 8-4v5z"/></svg>, text: "Eventos de todas las categorías culturales" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="5" r="2" fill="currentColor" stroke="none"/><path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z" fill="currentColor" stroke="none"/><path d="M6 16a6 6 0 1 0 12 0"/></svg>, text: "8 tipos de accesibilidad verificados" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>, text: "Lector de voz con resaltado en tiempo real" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, text: "Agenda semanal agrupada por día" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>, text: "Filtro por distrito y zona de Madrid" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>, text: "Enlace directo a compra de entradas" },
                ].map((item, i) => (
                  <li key={i} className="showcase-list-item">
                    <span className="showcase-list-icon" aria-hidden="true">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bloque de texto destacado */}
            <div className="showcase-callout">
              <p className="showcase-callout-text">
                Una experiencia cultural en Madrid que no se parece a ninguna otra
              </p>
              <p className="showcase-callout-sub">
                INCLUGO redefine cómo descubrir la cultura accesible en Madrid.
                Una sola plataforma te da acceso a <strong>más de 800 eventos culturales</strong> filtrados
                por tus necesidades reales de accesibilidad, actualizados cada día desde la
                <strong> API oficial del Ayuntamiento de Madrid</strong>.
              </p>
            </div>

          </div>
        </section>
        <section className="types-sec" aria-labelledby="types-heading">
          <div className="types-inner">
            <div className="types-head">
              <p className="sec-eyebrow">Lo que encontrarás</p>
              <h2 id="types-heading" className="types-heading">
                TODA LA CULTURA<br/>
                <span className="hl">DE MADRID</span>
              </h2>
            </div>
            <div className="types-grid">
              {TYPE_CARDS.map((t, i) => (
                <button
                  key={t.label}
                  className="type-card"
                  onClick={() => setEventsPage(t.cat)}
                  aria-label={`Ver eventos de ${t.label}`}
                >
                  <span className="type-card-num" aria-hidden="true">0{i + 1}</span>
                  <div className="type-card-body">
                    <h3 className="type-card-title">{t.label}</h3>
                    <p className="type-card-sub">{t.sub}</p>
                    <p className="type-card-desc">{t.desc}</p>
                  </div>
                  <span className="type-card-arrow" aria-hidden="true">
                    <ArrowRightIcon/>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how-sec" aria-labelledby="how-heading">
          <div className="how-inner">
            <p className="sec-eyebrow">¿Cómo funciona?</p>
            <h2 id="how-heading" className="how-heading">
              TRES PASOS,<br/>
              <span className="hl">SIN BARRERAS</span>
            </h2>
            <ol className="steps" aria-label="Pasos para usar INCLUGO">
              <li className="step">
                <span className="step-num-bg" aria-hidden="true">01</span>
                <span className="step-num-label" aria-hidden="true">— 01</span>
                <h3 className="step-title">Elige tus filtros</h3>
                <p className="step-desc">Selecciona los recursos de accesibilidad que necesitas: silla de ruedas, lengua de signos, audiodescripción y más.</p>
              </li>
              <li className="step">
                <span className="step-num-bg" aria-hidden="true">02</span>
                <span className="step-num-label" aria-hidden="true">— 02</span>
                <h3 className="step-title">Explora eventos</h3>
                <p className="step-desc">Visualiza únicamente los eventos de Madrid que cumplen tus criterios, actualizados diariamente desde la API del Ayuntamiento.</p>
              </li>
              <li className="step">
                <span className="step-num-bg" aria-hidden="true">03</span>
                <span className="step-num-label" aria-hidden="true">— 03</span>
                <h3 className="step-title">Ve y disfruta</h3>
                <p className="step-desc">Consulta información del recinto, transporte accesible cercano y accede directamente a la compra de entradas.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── EVENTS GRID ── */}
        <div ref={evRef} tabIndex={-1}>
          <EventsGrid onOpenDetail={(ev) => setSelectedEvent(ev)}/>
        </div>



        {/* ── ACCESIBILIDAD ── */}
        <section className="access-sec" aria-labelledby="access-heading">
          <div className="access-inner">
            <div className="access-head">
              <p className="sec-eyebrow">Accesibilidad</p>
              <h2 id="access-heading" className="access-heading">
                TODO TIPO<br/>
                <span className="hl">CUBIERTO</span>
              </h2>
            </div>
            <ul className="ac-grid" role="list" aria-label="Tipos de accesibilidad disponibles">
              {ACCESS_CARDS.map(item => {
                const info = ACCESS_INFO[item.key];
                return (
                  <li key={item.key} className="ac-card">
                    <div className="ac-icon" aria-hidden="true">{info && <info.Icon size={22}/>}</div>
                    <h3 className="ac-title">{info?.label || item.key}</h3>
                    <p className="ac-desc">{item.desc}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── BANNER AGENDA (estilo WAH "Cualquier excusa…") ── */}
        <section className="agenda-banner" aria-labelledby="agenda-banner-h">
          <div className="agenda-banner-inner">
            <div className="agenda-banner-head">
              <p className="sec-eyebrow" style={{ color: "#fff" }}>Planifica tu semana</p>
              <h2 id="agenda-banner-h" className="agenda-banner-h2">
                CUALQUIER DÍA<br/>
                <span className="hl-white">ES BUENO</span><br/>
                PARA LA CULTURA
              </h2>
            </div>
            <div className="agenda-banner-cards">
              <button className="agenda-banner-card" onClick={() => setEventsPage("Todos")}
                aria-label="Ver todos los eventos">
                <span className="agenda-banner-card-icon" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                </span>
                <strong className="agenda-banner-card-title">Para cualquier plan</strong>
                <p className="agenda-banner-card-desc">Más de 800 eventos culturales accesibles disponibles en Madrid.</p>
              </button>
              <button className="agenda-banner-card" onClick={() => setShowAgenda(true)}
                aria-label="Ver agenda semanal">
                <span className="agenda-banner-card-icon" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
                </span>
                <strong className="agenda-banner-card-title">Ver agenda semanal</strong>
                <p className="agenda-banner-card-desc">Todos los eventos de la semana agrupados por día, como una cartelera.</p>
              </button>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-sec" aria-labelledby="cta-heading">
          <div className="cta-inner">
            <h2 id="cta-heading" className="cta-h2">DESCUBRE<br/>MADRID</h2>
            <p className="cta-sub">Más de 800 eventos culturales accesibles al alcance de todos. Sin barreras, sin frustraciones.</p>
            <div className="cta-btns">
              <button className="btn-p" onClick={scrollToEvents}>Explorar eventos</button>
              <button className="btn-s" onClick={() => setShowAgenda(true)}>Ver agenda</button>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="footer" role="contentinfo">
        <p className="footer-logo" aria-label="INCLUGO">INCLU<em>GO</em></p>
        <nav aria-label="Navegación del pie de página">
          <ul className="footer-links" role="list">
            {["Eventos","Accesibilidad","Agenda","Acerca de","Contacto"].map(l => (
              <li key={l}>
                <button className="footer-link"
                  onClick={l === "Agenda" ? () => setShowAgenda(true) : l === "Eventos" ? () => setEventsPage("Todos") : undefined}>
                  {l}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <p className="footer-copy">TFG DAW · ILERNA Madrid · 2025/2026 · <span lang="es">Datos: Ayuntamiento de Madrid</span></p>
      </footer>

    </div>
  );
}