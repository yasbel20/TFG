import { useState, useRef } from "react";
import EventsGrid from "./eventsgrid";
import "./home.css";

/* ─── Iconos SVG — todos con aria-hidden="true" porque el texto los acompaña ── */
const WheelIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    aria-hidden="true" focusable="false">
    <circle cx="12" cy="5" r="2" fill="currentColor" stroke="none"/>
    <path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z" fill="currentColor" stroke="none"/>
    <path d="M6 16a6 6 0 1 0 12 0" strokeWidth="2"/>
  </svg>
);
const HandsIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false">
    <path d="M7 4v6L5 8V5a1 1 0 0 1 2 0v3l1.5.75V4a1 1 0 0 1 2 0v6.5L9 9V4zM13 10c0-1 .9-1.8 2-1.8s2 .8 2 1.8v5c0 2.5-1.8 4.3-4 4.3S9 17.5 9 15v-4.5l4 4V12z"/>
  </svg>
);
const AudioIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <circle cx="12" cy="12" r="7" fill="none"/>
    <circle cx="12" cy="12" r="11" fill="none" strokeOpacity=".4"/>
  </svg>
);
const SubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false">
    <rect x="2" y="6" width="20" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="11" width="6" height="2" rx="1"/>
    <rect x="12" y="11" width="8" height="2" rx="1"/>
    <rect x="4" y="15" width="10" height="2" rx="1"/>
  </svg>
);
const LoopIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false">
    <rect x="2" y="9" width="3" height="6" rx="1"/>
    <rect x="19" y="9" width="3" height="6" rx="1"/>
    <path d="M5 10C5 7 7.5 5 12 5s7 2 7 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 14c0 3 2.5 5 7 5s7-2 7-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const BrailleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false">
    {[6,11].map(x => [5,10,15].map(y => <circle key={`${x}${y}`} cx={x} cy={y} r="1.8"/>))}
    {[15,20].map(x => [5,10,15].map(y => <circle key={`r${x}${y}`} cx={x} cy={y} r="1.8"/>))}
  </svg>
);
const EasyIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="3" rx="1.5"/>
    <rect x="3" y="10.5" width="14" height="3" rx="1.5"/>
    <rect x="3" y="16" width="10" height="3" rx="1.5"/>
  </svg>
);
const QuietIcon = ({ size = 16 }) => (
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

/* ─── Datos estáticos ─────────────────────────────────────────────────────── */
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
export default function INCLUGOHome() {
  const [inputVal, setInputVal] = useState("");
  const evRef = useRef(null);

  const scrollToEvents = () =>
    evRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleHint = (hint) => {
    setInputVal(hint);
    scrollToEvents();
  };

  return (
    /* lang se pone en index.html, aquí solo el contenido */
    <div className="ir">

      {/* Skip link — WCAG 2.4.1: saltar al contenido principal */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* ── NAV ── */}
      <header role="banner">
        <nav className="nav" aria-label="Navegación principal">
          {/* Logo como button porque hace scroll/navigate */}
          <button className="logo" onClick={scrollToEvents} aria-label="INCLUGO — ir al inicio">
            INCLU<em>GO</em>
          </button>

          {/* Lista de navegación semántica */}
          <ul className="nav-links" role="list">
            <li>
              <button className="nav-link" onClick={scrollToEvents}>
                Eventos
              </button>
            </li>
            <li>
              <button className="nav-link">Accesibilidad</button>
            </li>
            <li>
              <button className="nav-link">Acerca de</button>
            </li>
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
          {/* Elementos decorativos — ocultos a lectores de pantalla */}
          <div className="hero-bg-circle" aria-hidden="true"/>
          <div className="hero-bg-sq"     aria-hidden="true"/>

          <div className="hero-inner">
            {/* Texto decorativo — no es heading */}
            <p className="hero-pill" aria-hidden="true">
              Madrid · Cultura Accesible
            </p>

            <h1 id="hero-heading" className="hero-h1">
              Cultura sin barreras.
            </h1>

            <p className="hero-sub">
              Descubre eventos culturales accesibles en Madrid. Filtra por tus necesidades
              y disfruta de la ciudad en igualdad de condiciones.
            </p>

            {/* Formulario de búsqueda con label asociado */}
            <div className="search-wrap" role="search">
              <div className="search-bar">
                <span className="search-icon-wrap" aria-hidden="true">
                  <SearchIcon/>
                </span>
                {/* Label oculto visualmente pero leído por lectores de pantalla */}
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

              {/* Sugerencias como botones reales */}
              <div className="search-hint" aria-label="Búsquedas sugeridas">
                {[
                  { label: "Conciertos", query: "concierto" },
                  { label: "Teatro",     query: "teatro"    },
                  { label: "Exposiciones", query: "exposición" },
                  { label: "Gratis",     query: "gratis"    },
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

        {/* ── STATS — aria-label para cada cifra ── */}
        <section className="stats" aria-label="Cifras clave de INCLUGO">
          <div className="stats-grid">
            <div className="stat">
              {/* aria-label da el número completo, el visual puede ser abreviado */}
              <p className="stat-num" aria-label="500.000">
                500<sup aria-hidden="true">k</sup>
              </p>
              <p className="stat-label">Personas con discapacidad en Madrid</p>
            </div>
            <div className="stat">
              <p className="stat-num" aria-label="Más de 800">
                800<sup aria-hidden="true">+</sup>
              </p>
              <p className="stat-label">Eventos culturales activos</p>
            </div>
            <div className="stat">
              <p className="stat-num">8</p>
              <p className="stat-label">Tipos de accesibilidad cubiertos</p>
            </div>
          </div>
        </section>

        {/* ── HOW ── */}
        <section
          className="sec"
          style={{ background: "var(--c)" }}
          aria-labelledby="how-heading"
        >
          <div className="sec-inner">
            <div className="sec-head">
              <div>
                <p className="sec-label" aria-hidden="true">¿Cómo funciona?</p>
                <h2 id="how-heading" className="sec-title">
                  Tres pasos, sin barreras
                </h2>
              </div>
            </div>

            {/* Lista ordenada — los pasos tienen orden lógico */}
            <ol className="steps" aria-label="Pasos para usar INCLUGO">
              <li className="step">
                {/* Número decorativo — el li da el orden */}
                <p className="step-num" aria-hidden="true">01</p>
                <h3 className="step-title">Elige tus filtros</h3>
                <p className="step-desc">
                  Selecciona los recursos de accesibilidad que necesitas: silla de ruedas,
                  lengua de signos, audiodescripción y más.
                </p>
              </li>
              <li className="step">
                <p className="step-num" aria-hidden="true">02</p>
                <h3 className="step-title">Explora eventos</h3>
                <p className="step-desc">
                  Visualiza únicamente los eventos de Madrid que cumplen tus criterios,
                  actualizados diariamente desde la API del Ayuntamiento.
                </p>
              </li>
              <li className="step">
                <p className="step-num" aria-hidden="true">03</p>
                <h3 className="step-title">Ve y disfruta</h3>
                <p className="step-desc">
                  Consulta información del recinto, transporte accesible cercano
                  y accede directamente a la compra de entradas.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── EVENTS GRID — componente separado ── */}
        <div ref={evRef} tabIndex={-1}>
          <EventsGrid />
        </div>

        {/* ── API INFO BANNER ── */}
        <aside className="api-info-sec" aria-label="Información sobre la fuente de datos">
          <div className="api-info-inner">
            <p className="api-badge">
              <span className="api-dot" aria-hidden="true"/>
              API en tiempo real · Ayuntamiento de Madrid
            </p>
            <p className="api-text">
              Datos obtenidos de la{" "}
              <a
                href="https://datos.madrid.es/egob/catalogo/206974-0-agenda-eventos-culturales-100.json"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="API Agenda de Eventos Culturales del Ayuntamiento de Madrid (abre en nueva pestaña)"
              >
                API Agenda de Eventos Culturales
              </a>{" "}
              del Portal de Datos Abiertos del Ayuntamiento de Madrid.
              Actualización diaria automática.
            </p>
          </div>
        </aside>

        {/* ── ACCESIBILIDAD TIPOS ── */}
        <section className="access-sec" aria-labelledby="access-heading">
          <div className="sec-inner">
            <div className="sec-head">
              <div>
                <p className="sec-label" aria-hidden="true">Accesibilidad</p>
                <h2 id="access-heading" className="sec-title">
                  Todo tipo de accesibilidad, cubierta
                </h2>
              </div>
            </div>

            {/* Lista de tipos de accesibilidad */}
            <ul className="ac-grid" role="list" aria-label="Tipos de accesibilidad disponibles">
              {ACCESS_CARDS.map(item => {
                const info = ACCESS_INFO[item.key];
                return (
                  <li key={item.key} className="ac-card">
                    {/* Icono decorativo — el título lo describe */}
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
          <h2 id="cta-heading" className="cta-h2">
            ¿Listo para descubrir Madrid?
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
        </section>

      </main>{/* /main */}

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
          <span lang="es">Datos: Ayuntamiento de Madrid (datos abiertos)</span>
        </p>
      </footer>

    </div>
  );
}