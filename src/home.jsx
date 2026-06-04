import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventsGrid from "./eventsgrid";
import Navbar from "./Navbar";
import { WheelIcon, HandsIcon, BucleIcon, PodoIcon } from "./AccessibilityIcons";
import { toSlug } from "./utils/formatting";
import { ACCESS_INFO as ACCESS_INFO_BASE } from "./constants/accessibility";
import { useStatsCountUp } from "./hooks/useStatsCountUp";
import AgendaDestacada from "./components/home/AgendaDestacada";
import ToolsShowcase from "./components/home/ToolsShowcase";
import GhostHelper from "./components/home/GhostHelper";
import FaqSection from "./components/home/FaqSection";
import "./home.css";


const AudioIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <circle cx="12" cy="12" r="7" fill="none"/>
    <circle cx="12" cy="12" r="11" fill="none" strokeOpacity=".35"/>
  </svg>
);
const SubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <rect x="2" y="6" width="20" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="11" width="6" height="2" rx="1"/>
    <rect x="12" y="11" width="8" height="2" rx="1"/>
    <rect x="4" y="15" width="10" height="2" rx="1"/>
  </svg>
);
const EasyIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="3" rx="1.5"/>
    <rect x="3" y="10.5" width="14" height="3" rx="1.5"/>
    <rect x="3" y="16" width="10" height="3" rx="1.5"/>
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
const ACCESS_ICONS = {
  silla:      WheelIcon,
  signos:     HandsIcon,
  audio:      AudioIcon,
  subtitulos: SubIcon,
  bucle:      BucleIcon,
  podo:       PodoIcon,
  lectura:    EasyIcon,
};

const ACCESS_INFO = Object.fromEntries(
  Object.entries(ACCESS_INFO_BASE).map(([k, v]) => [k, { ...v, Icon: ACCESS_ICONS[k] }])
);

const ACCESS_CARDS = [
  { key: "silla",  desc: "Espacios 100% libres de barreras físicas, rampas y plazas PMR reservadas."                      },
  { key: "signos", desc: "Eventos con intérpretes certificados para que no te pierdas ni un detalle."                     },
  { key: "podo",   desc: "Pavimento con relieve y bandas de guiado para orientarte de forma segura por el recinto."       },
  { key: "bucle",  desc: "Sonido nítido y sin ruido de fondo directo a tu audífono o implante coclear."                   },
];

const EVENT_CATS_ALL = ["Todos los eventos","Música","Teatro","Exposición","Cine","Danza","Cultura"];
const ACCESS_CATS    = ["Toda la accesibilidad","Silla de ruedas","Lengua de signos","Podotáctil","Bucle magnético"];

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
  {
    label: "CINE",
    sub:   "Subtítulos · Audiodescripción · Ciclos",
    desc:  "Proyecciones accesibles con subtítulos para personas sordas y audiodescripción integrada.",
    cat:   "Cine",
  },
  {
    label: "DANZA",
    sub:   "Ballet · Contemporáneo · Flamenco",
    desc:  "Espectáculos de danza con intérpretes de LSE y espacios totalmente accesibles para PMR.",
    cat:   "Danza",
  },
  {
    label: "CULTURA",
    sub:   "Talleres · Conferencias · Festivales",
    desc:  "Actividades culturales diversas adaptadas para todos los públicos y necesidades.",
    cat:   "Cultura",
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
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════ */
export default function INCLUGOHome() {
  const navigate = useNavigate();
  const [inputVal,  setInputVal]  = useState("");
  const evRef = useRef(null);
  const [[count500, count800, count4], statsRef] = useStatsCountUp([500, 800, 4]);

  const scrollToEvents = () =>
    evRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleHint = (hint) => { setInputVal(hint); scrollToEvents(); };

  return (
    <div className="ir">

      {/* ── NAV compartido ── */}
      <Navbar />

      <main id="main-content">

        {/* ── HERO ── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-left">
            <h1 id="hero-heading" className="hero-h1">
              CULTURA<br/>
              <span className="hl">SIN</span><br/>
              BARRERAS
            </h1>
            <p className="hero-sub">
              Tu guía definitiva para descubrir el ocio y los eventos accesibles de Madrid. Elige los filtros que se adaptan a ti y sal a disfrutar de la ciudad a tu manera, sin que nada te detenga
            </p>
            <button id="hero-cta" className="hero-cta" onClick={() => navigate("/eventos")}>
              Ver eventos
            </button>
          </div>
          <div className="hero-right" aria-hidden="true">
            <img src="/img/heroes/herohome.png" alt="" />
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="stats reveal" aria-label="Cifras clave de INCLUGO" ref={statsRef}>
          <div className="stats-grid">
            <div className="stat" tabIndex={0}>
              <span className="stat-num" aria-label="500.000">{count500}<sup aria-hidden="true">K</sup></span>
              <span className="stat-label">Madrileños que buscan una ciudad más inclusiva</span>
            </div>
            <div className="stat" tabIndex={0}>
              <span className="stat-num" aria-label="Más de 800">{count800}<sup aria-hidden="true">+</sup></span>
              <span className="stat-label">Planes culturales esperándote hoy mismo</span>
            </div>
            <div className="stat" tabIndex={0}>
              <span className="stat-num">{count4}</span>
              <span className="stat-label">Tipos de accesibilidad cubiertos</span>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how-sec reveal" aria-labelledby="how-heading">
          <div className="how-inner">
            <p className="sec-eyebrow">Así de fácil</p>
            <h2 id="how-heading" className="how-heading">
              TRES PASOS<br/>
              <span className="hl">SIN BARRERAS</span>
            </h2>
            <ol className="steps" aria-label="Pasos para usar INCLUGO">
              <li className="step" tabIndex={0}>
                <span className="step-num-bg" aria-hidden="true">01</span>
                <span className="step-num-label" aria-hidden="true">— 01</span>
                <h3 className="step-title">Elige tus filtros</h3>
                <p className="step-desc">Marca tus necesidades: silla de ruedas, lengua de signos, pavimento podotáctil, bucle magnético y más.</p>
              </li>
              <li className="step" tabIndex={0}>
                <span className="step-num-bg" aria-hidden="true">02</span>
                <span className="step-num-label" aria-hidden="true">— 02</span>
                <h3 className="step-title">Explora eventos</h3>
                <p className="step-desc">Ve solo los planes de Madrid que encajan contigo, con información oficial y actualizada cada día.</p>
              </li>
              <li className="step" tabIndex={0}>
                <span className="step-num-bg" aria-hidden="true">03</span>
                <span className="step-num-label" aria-hidden="true">— 03</span>
                <h3 className="step-title">Ve y disfruta</h3>
                <p className="step-desc">Consulta los detalles de accesibilidad del recinto, calcula tu ruta directa en el mapa y sal a disfrutar del plan sin sorpresas.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── HERRAMIENTAS DE ACCESIBILIDAD ── */}
        <section className="tools-sec reveal" aria-labelledby="tools-heading">
          <ToolsShowcase />
        </section>

        {/* ── ACCESIBILIDAD ── */}
        <section className="access-sec reveal" aria-labelledby="access-heading">
          <div className="access-inner">
            <div className="access-head">
              <p className="sec-eyebrow">Acceso garantizado</p>
              <h2 id="access-heading" className="access-heading">
                EVENTOS<br/>
                <span className="hl">A TU MEDIDA</span>
              </h2>
            </div>
            <ul className="ac-grid" role="list" aria-label="Tipos de accesibilidad disponibles">
              {ACCESS_CARDS.map(item => {
                const info = ACCESS_INFO[item.key];
                return (
                  <li key={item.key} className="ac-card" tabIndex={0}>
                    <div className="ac-icon" aria-hidden="true">{info && <info.Icon size={22}/>}</div>
                    <h3 className="ac-title">{info?.label || item.key}</h3>
                    <p className="ac-desc">{item.desc}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── TYPES ── */}
        <section className="types-sec reveal" aria-labelledby="types-heading">
          <div className="types-inner">
            <div className="types-head">
              <p className="sec-eyebrow">Elige tu plan</p>
              <h2 id="types-heading" className="types-heading">
                TODA LA <br/>
                <span className="hl">CULTURA DE MADRID</span>
              </h2>
            </div>
            <div className="types-grid">
              {TYPE_CARDS.map((t, i) => (
                <button
                  key={t.label}
                  className="type-card"
                  onClick={() => navigate(`/eventos/${toSlug(t.cat)}`)}
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

        {/* ── AGENDA DESTACADA ── */}
        <AgendaDestacada/>

        {/* ── EVENTS GRID ── */}
        <div ref={evRef} tabIndex={-1}>
          <EventsGrid onOpenDetail={(ev) => navigate(`/evento/${ev.id}`, { state: { ev } })}/>
        </div>

        {/* ── FAQ ── */}
        <FaqSection/>

        {/* ── CTA ── */}
        <section className="cta-sec reveal" aria-labelledby="cta-heading">
          <div className="cta-inner">
            <h2 id="cta-heading" className="cta-h2">MADRID TE ESPERA, SIEMPRE ACCESIBLE</h2>
            <p className="cta-sub">No busques dónde encajar, busca qué quieres vivir.<br/>Para que el camino sea siempre accesible.</p>
            <div className="cta-btns">
              <button className="btn-p" onClick={scrollToEvents}>Explorar eventos</button>
              <button className="btn-s" onClick={() => navigate("/agenda")}>Ver agenda</button>
            </div>
          </div>
        </section>

      </main>

      <GhostHelper/>

    </div>
  );
}