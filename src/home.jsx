import { useState, useRef, useEffect } from "react";
import EventsGrid from "./eventsgrid";
import "./home.css";

/* ── Iconos SVG (aria-hidden en todos — el texto los acompaña) ── */
const WheelIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    aria-hidden="true" focusable="false">
    <circle cx="12" cy="5" r="2" fill="currentColor" stroke="none"/>
    <path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z" fill="currentColor" stroke="none"/>
    <path d="M6 16a6 6 0 1 0 12 0" strokeWidth="2"/>
  </svg>
);
const HandsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false">
    <path d="M7 4v6L5 8V5a1 1 0 0 1 2 0v3l1.5.75V4a1 1 0 0 1 2 0v6.5L9 9V4zM13 10c0-1 .9-1.8 2-1.8s2 .8 2 1.8v5c0 2.5-1.8 4.3-4 4.3S9 17.5 9 15v-4.5l4 4V12z"/>
  </svg>
);
const AudioIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <circle cx="12" cy="12" r="7" fill="none"/>
    <circle cx="12" cy="12" r="11" fill="none" strokeOpacity=".35"/>
  </svg>
);
const SubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false">
    <rect x="2" y="6" width="20" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="11" width="6" height="2" rx="1"/>
    <rect x="12" y="11" width="8" height="2" rx="1"/>
    <rect x="4" y="15" width="10" height="2" rx="1"/>
  </svg>
);
const LoopIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false">
    <rect x="2" y="9" width="3" height="6" rx="1"/>
    <rect x="19" y="9" width="3" height="6" rx="1"/>
    <path d="M5 10C5 7 7.5 5 12 5s7 2 7 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 14c0 3 2.5 5 7 5s7-2 7-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const BrailleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false">
    {[6,11].map(x => [5,10,15].map(y => <circle key={`${x}${y}`} cx={x} cy={y} r="1.8"/>))}
    {[15,20].map(x => [5,10,15].map(y => <circle key={`r${x}${y}`} cx={x} cy={y} r="1.8"/>))}
  </svg>
);
const EasyIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="3" rx="1.5"/>
    <rect x="3" y="10.5" width="14" height="3" rx="1.5"/>
    <rect x="3" y="16" width="10" height="3" rx="1.5"/>
  </svg>
);
const QuietIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    aria-hidden="true" focusable="false">
    <path d="M9 9a3 3 0 1 1 6 0c0 3-3 4-3 4"/>
    <circle cx="12" cy="17" r="1" fill="currentColor"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);
const SearchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="7"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

/* ── Datos estáticos ── */
const ACCESS_INFO = {
  silla:      { label: "Silla de ruedas",   Icon: WheelIcon   },
  signos:     { label: "Lengua de signos",  Icon: HandsIcon   },
  audio:      { label: "Audiodescripción",  Icon: AudioIcon   },
  subtitulos: { label: "Subtítulos",        Icon: SubIcon     },
  bucle:      { label: "Bucle magnético",   Icon: LoopIcon    },
  braille:    { label: "Braille",           Icon: BrailleIcon },
  lectura:    { label: "Lectura fácil",     Icon: EasyIcon    },
  tranquilo:  { label: "Horario tranquilo", Icon: QuietIcon   },
};

const ACCESS_CARDS = [
  { key: "silla",   desc: "Acceso en silla de ruedas, rampas, ascensores y plazas PMR reservadas."  },
  { key: "signos",  desc: "Intérpretes de lengua de signos certificados presentes en el evento."    },
  { key: "braille", desc: "Materiales y señalización táctil en braille en el recinto cultural."     },
  { key: "bucle",   desc: "Sistema de inducción magnética para audífonos e implantes cocleares."    },
];

/* ─── Componente ──────────────────────────────────────────────────────────── */
const EVENT_CATS = ["Música","Teatro","Exposición","Cine","Danza","Cultura"];

function toSlug(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/* ── Componente principal ── */
export default function INCLUGOHome() {
  const [inputVal, setInputVal] = useState("");
  const evRef = useRef(null);

  // Calcula la duración del ticker según su ancho real
  // 80px/s = velocidad cómoda para leer sin esfuerzo
  useEffect(() => {
    const el = document.getElementById("ticker-inner");
    if (!el) return;
    // El inner tiene 2 copias → el loop recorre la mitad del ancho
    const halfWidth = el.scrollWidth / 2;
    const pxPerSecond = 80;
    const duration = Math.round(halfWidth / pxPerSecond);
    el.style.animationDuration = `${duration}s`;
  }, []);

  const scrollToEvents = () =>
    evRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleHint = (hint) => {
    setInputVal(hint);
    scrollToEvents();
  };

  return (
    <div className="ir">

      {/* Skip link — WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* ── NAV ── */}
      <header role="banner">
        <nav className="nav" aria-label="Navegación principal">
          <button className="logo" onClick={scrollToEvents} aria-label="INCLUGO — ir al inicio">
            INCLU<em>GO</em>
          </button>

          <ul className="nav-links" role="list">
            <li><button className="nav-link" onClick={scrollToEvents}>Eventos</button></li>
            <li><button className="nav-link">Accesibilidad</button></li>
            <li><button className="nav-link">Acerca de</button></li>
          </ul>

          <button className="nav-cta" onClick={scrollToEvents}>
            Ver eventos
          </button>
        </nav>
      </header>

      {/* ── MAIN ── */}
      <main id="main-content">

        {/* ── HERO ── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-inner">
            <p className="hero-eyebrow" aria-hidden="true">
              Madrid · Cultura Accesible
            </p>

            <h1 id="hero-heading" className="hero-h1">
              CULTURA<br/>
              <span className="hl">SIN</span><br/>
              BARRERAS
            </h1>

            <p className="hero-sub">
              Descubre eventos culturales accesibles en Madrid. Filtra por tus necesidades
              y disfruta de la ciudad en igualdad de condiciones.
            </p>

            {/* Buscador con label accesible */}
            <div className="search-wrap" role="search">
              <div className="search-bar">
                <span className="search-icon-wrap" aria-hidden="true">
                  <SearchIcon/>
                </span>
                <label htmlFor="search-input" className="sr-only">
                  Buscar evento, lugar o categoría
                </label>
                <input
                  id="search-input"
                  className="search-input"
                  type="search"
                  placeholder="Busca un evento, lugar o categoría..."
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && scrollToEvents()}
                  autoComplete="off"
                />
                <button
                  className="search-btn"
                  onClick={scrollToEvents}
                  aria-label="Buscar eventos"
                >
                  Buscar
                </button>
              </div>

              <div className="search-hint" aria-label="Búsquedas sugeridas">
                {[
                  { label: "Conciertos",    query: "concierto"   },
                  { label: "Teatro",        query: "teatro"      },
                  { label: "Exposiciones",  query: "exposición"  },
                  { label: "Gratis",        query: "gratis"      },
                ].map(({ label, query }) => (
                  <button
                    key={query}
                    className="search-hint-btn"
                    onClick={() => handleHint(query)}
                    aria-label={`Buscar ${label}`}
                  >
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
              <span className="stat-num" aria-label="500.000">
                500<sup aria-hidden="true">K</sup>
              </span>
              <span className="stat-label">Personas con discapacidad en Madrid</span>
            </div>
            <div className="stat">
              <span className="stat-num" aria-label="Más de 800">
                800<sup aria-hidden="true">+</sup>
              </span>
              <span className="stat-label">Eventos culturales activos</span>
            </div>
            <div className="stat">
              <span className="stat-num">8</span>
              <span className="stat-label">Tipos de accesibilidad cubiertos</span>
            </div>
          </div>
        </section>

        {/* ── HOW ── */}
        <section className="how-sec" aria-labelledby="how-heading">
          <div className="how-inner">
            <p className="sec-eyebrow" aria-hidden="true">¿Cómo funciona?</p>
            <h2 id="how-heading" className="how-heading">
              TRES PASOS,<br/>
              <span className="hl">SIN BARRERAS</span>
            </h2>

            <ol className="steps" aria-label="Pasos para usar INCLUGO">
              <li className="step">
                <span className="step-num-bg" aria-hidden="true">01</span>
                <span className="step-num-label" aria-hidden="true">— 01</span>
                <h3 className="step-title">Elige tus filtros</h3>
                <p className="step-desc">
                  Selecciona los recursos de accesibilidad que necesitas: silla de ruedas,
                  lengua de signos, audiodescripción y más.
                </p>
              </li>
              <li className="step">
                <span className="step-num-bg" aria-hidden="true">02</span>
                <span className="step-num-label" aria-hidden="true">— 02</span>
                <h3 className="step-title">Explora eventos</h3>
                <p className="step-desc">
                  Visualiza únicamente los eventos de Madrid que cumplen tus criterios,
                  actualizados diariamente desde la API del Ayuntamiento.
                </p>
              </li>
              <li className="step">
                <span className="step-num-bg" aria-hidden="true">03</span>
                <span className="step-num-label" aria-hidden="true">— 03</span>
                <h3 className="step-title">Ve y disfruta</h3>
                <p className="step-desc">
                  Consulta información del recinto, transporte accesible cercano
                  y accede directamente a la compra de entradas.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── EVENTS GRID ── */}
        <div ref={evRef} tabIndex={-1}>
          <EventsGrid />
        </div>

        {/* ── ACCESIBILIDAD ── */}
        <section className="access-sec" aria-labelledby="access-heading">
          <div className="access-inner">
            <div className="access-head">
              <p className="sec-eyebrow" aria-hidden="true">Accesibilidad</p>
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
                    <div className="ac-icon" aria-hidden="true">
                      {info && <info.Icon size={22}/>}
                    </div>
                    <h3 className="ac-title">{info?.label || item.key}</h3>
                    <p className="ac-desc">{item.desc}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-sec" aria-labelledby="cta-heading">
          <div className="cta-inner">
            <h2 id="cta-heading" className="cta-h2">
              DESCUBRE<br/>MADRID
            </h2>
            <p className="cta-sub">
              Más de 800 eventos culturales accesibles al alcance de todos.
              Sin barreras, sin frustraciones.
            </p>
            <div className="cta-btns">
              <button className="btn-p" onClick={scrollToEvents}>
                Explorar eventos
              </button>
              <button className="btn-s">
                Saber más
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="footer" role="contentinfo">
        <p className="footer-logo" aria-label="INCLUGO">
          INCLU<em>GO</em>
        </p>

        <nav aria-label="Navegación del pie de página">
          <ul className="footer-links" role="list">
            {["Eventos","Accesibilidad","Acerca de","Contacto"].map(l => (
              <li key={l}>
                <button className="footer-link">{l}</button>
              </li>
            ))}
          </ul>
        </nav>

        <p className="footer-copy">
          TFG DAW · ILERNA Madrid · 2025/2026 ·{" "}
          <span lang="es">Datos: Ayuntamiento de Madrid</span>
        </p>
      </footer>

    </div>
  );
}
