import { useState, useEffect, useRef } from "react";

// ─── Categorías y colores de fallback ────────────────────────────────────────
const CAT_COLORS = {
  "Música":     { bg: "#1A237E", accent: "#C9D11A" },
  "Teatro":     { bg: "#2E3A8C", accent: "#C9D11A" },
  "Exposición": { bg: "#0E1355", accent: "#3D47C8" },
  "Cine":       { bg: "#1A237E", accent: "#C9D11A" },
  "Danza":      { bg: "#2E3A8C", accent: "#C9D11A" },
  "Cultura":    { bg: "#0E1355", accent: "#3D47C8" },
  "Deporte":    { bg: "#1A237E", accent: "#C9D11A" },
};

const CATEGORIES = ["Todos", "Música", "Teatro", "Exposición", "Cine", "Danza", "Cultura"];

// ─── Iconos ───────────────────────────────────────────────────────────────────
const CalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);
const WheelIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2"/><path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z"/>
    <path d="M6 16a6 6 0 1 0 12 0" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const AccessIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A8.001 8.001 0 0 1 4.07 11H5a1 1 0 0 1 0 2h-.93A8.001 8.001 0 0 1 11 4.07V5a1 1 0 0 1 2 0v-.93A8.001 8.001 0 0 1 19.93 11H19a1 1 0 0 1 0-2h.93A8.001 8.001 0 0 1 13 16.93z"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

// ─── Parsear eventos de la API del Ayuntamiento de Madrid ─────────────────────
/**
 * API: https://datos.madrid.es/egob/catalogo/206974-0-agenda-eventos-culturales-100.json
 * Documentación: https://datos.madrid.es/portal/site/egob
 */
function parseEvent(item, i) {
  const desc = ((item.description || "") + " " + (item.organization?.["organization-name"] || "")).toLowerCase();

  // Categoría
  const t = (item.title || "").toLowerCase();
  let cat = "Cultura";
  if (/concierto|música|jazz|flamenco|rock|pop|música/.test(t + desc)) cat = "Música";
  else if (/teatro|obra|danza|ballet|ópera/.test(t + desc))            cat = "Teatro";
  else if (/exposici|muestra|exhibit|galería/.test(t + desc))          cat = "Exposición";
  else if (/cine|film|pelícu/.test(t + desc))                          cat = "Cine";
  else if (/danza|baile|flamenco/.test(t + desc))                      cat = "Danza";
  else if (/deporte|sport|carrera|maratón/.test(t + desc))             cat = "Deporte";

  // Accesibilidad
  const access = [];
  if (/silla|ruedas|pmr|accesib|rampa/.test(desc)) access.push("silla");
  if (/signos|sord/.test(desc))                     access.push("signos");
  if (/audiodescrip/.test(desc))                    access.push("audio");
  if (/subtítu|subtitulad/.test(desc))              access.push("subtitulos");
  if (access.length === 0)                          access.push("silla");

  // Precio
  let price = "Gratis";
  const fee = item["event-free"] ?? item.free;
  if (fee === false || fee === "false" || fee === 0 || fee === "0") {
    const raw = item["event-fee"] || item.price || "";
    price = raw ? `Desde ${raw} €` : "Ver precio";
  }

  // Fechas
  let date = "Consultar fecha";
  let dateShort = "Consultar";
  if (item.dtstart) {
    const s = new Date(item.dtstart);
    const e = item.dtend ? new Date(item.dtend) : null;
    const fmt     = { day: "numeric", month: "short" };
    const fmtFull = { day: "numeric", month: "long", year: "numeric" };
    dateShort = s.toLocaleDateString("es-ES", fmt).toUpperCase();
    date = s.toLocaleDateString("es-ES", fmtFull);
    if (e && e.toDateString() !== s.toDateString()) {
      dateShort = `${s.toLocaleDateString("es-ES", fmt)} – ${e.toLocaleDateString("es-ES", fmt)}`.toUpperCase();
    }
  }

  // Imagen: la API devuelve a veces una URL en item.media o item.image
  let image = null;
  if (item.media?.["@id"]) image = item.media["@id"];
  else if (item.image)     image = item.image;
  else if (item.media?.url) image = item.media.url;

  // Lugar
  const venue = item.location?.["street-address"]
    || item.organization?.["organization-name"]
    || item["event-location"]?.["@id"]
    || "Madrid";

  return {
    id:      item.id || `ev-${i}`,
    title:   item.title || "Evento sin título",
    cat,
    date,
    dateShort,
    venue:   venue.length > 40 ? venue.slice(0, 38) + "…" : venue,
    district: item.address?.["locality"] || "Madrid",
    price,
    access,
    image,
    url:     item.link || "#",
    desc:    (item.description || "").replace(/<[^>]+>/g, "").slice(0, 100),
  };
}

// ─── Datos de muestra si la API falla ────────────────────────────────────────
const SAMPLE = [
  { id:1, title:"Jazz en el Conde Duque",       cat:"Música",     dateShort:"12 ABR",         date:"12 de abril de 2026",   venue:"C.C. Conde Duque",       district:"Centro",   price:"Gratis",    access:["silla","signos"],    image:null, url:"#" },
  { id:2, title:"Picasso: Miradas múltiples",   cat:"Exposición", dateShort:"HASTA 30 ABR",   date:"Hasta 30 de abril",     venue:"Museo Reina Sofía",      district:"Atocha",   price:"12 €",      access:["silla","audio"],     image:null, url:"#" },
  { id:3, title:"La Casa de Bernarda Alba",     cat:"Teatro",     dateShort:"18–20 ABR",      date:"18 al 20 de abril",     venue:"Teatro Español",         district:"Centro",   price:"15 €",      access:["subtitulos"],        image:null, url:"#" },
  { id:4, title:"Cine: Todo sobre mi madre",    cat:"Cine",       dateShort:"15 ABR",         date:"15 de abril de 2026",   venue:"Filmoteca Española",     district:"Lavapiés", price:"3 €",       access:["audio","subtitulos"],image:null, url:"#" },
  { id:5, title:"Concierto flamenco accesible", cat:"Música",     dateShort:"20 ABR",         date:"20 de abril de 2026",   venue:"Café de las Artes",      district:"Malasaña", price:"10 €",      access:["silla"],             image:null, url:"#" },
  { id:6, title:"Feria del Libro de Madrid",    cat:"Cultura",    dateShort:"24 ABR–1 MAY",   date:"24 abril al 1 mayo",    venue:"Parque del Retiro",      district:"Retiro",   price:"Gratis",    access:["silla"],             image:null, url:"#" },
  { id:7, title:"Noche de Danza Contemporánea", cat:"Danza",      dateShort:"22 ABR",         date:"22 de abril de 2026",   venue:"Teatro del Canal",       district:"Chamberí", price:"18 €",      access:["silla","signos"],    image:null, url:"#" },
  { id:8, title:"Exposición: Carteles Madrid",  cat:"Exposición", dateShort:"TODO ABR",       date:"Todo abril",            venue:"Círculo de Bellas Artes",district:"Centro",   price:"Gratis",    access:["silla"],             image:null, url:"#" },
];

// ─── Hook de datos ────────────────────────────────────────────────────────────
function useEvents(activeCategory) {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [fromApi, setFromApi]     = useState(false);

  useEffect(() => {
    const API = "https://datos.madrid.es/egob/catalogo/206974-0-agenda-eventos-culturales-100.json";
    fetch(API)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const parsed = (data["@graph"] || []).map(parseEvent);
        setAllEvents(parsed);
        setFromApi(true);
        setLoading(false);
      })
      .catch(() => {
        setAllEvents(SAMPLE);
        setFromApi(false);
        setLoading(false);
      });
  }, []);

  const byCategory = (cat) =>
    cat === "Todos" ? allEvents : allEvents.filter(e => e.cat === cat);

  return { byCategory, loading, fromApi, total: allEvents.length };
}

// ─── Componente tarjeta ───────────────────────────────────────────────────────
function EventCard({ ev }) {
  const colors = CAT_COLORS[ev.cat] || CAT_COLORS["Cultura"];
  const [imgOk, setImgOk] = useState(!!ev.image);

  return (
    <a
      className="eg-card"
      href={ev.url !== "#" ? ev.url : undefined}
      target={ev.url !== "#" ? "_blank" : undefined}
      rel="noreferrer"
      aria-label={ev.title}
    >
      {/* Imagen o fallback de color */}
      <div className="eg-img-wrap">
        {ev.image && imgOk ? (
          <img
            src={ev.image}
            alt={ev.title}
            className="eg-img"
            onError={() => setImgOk(false)}
            loading="lazy"
          />
        ) : (
          <div className="eg-img-fallback" style={{ background: colors.bg }}>
            <span className="eg-fallback-cat" style={{ color: colors.accent }}>{ev.cat}</span>
            <span className="eg-fallback-title">{ev.title}</span>
          </div>
        )}
        {/* Badge de precio encima */}
        <div className="eg-price-badge">
          {ev.price === "Gratis"
            ? <span className="eg-badge-free">Gratis</span>
            : <span className="eg-badge-price">{ev.price}</span>
          }
        </div>
        {/* Badge de accesibilidad */}
        {ev.access.includes("silla") && (
          <div className="eg-access-badge" title="Accesible en silla de ruedas">
            <WheelIcon/> Accesible
          </div>
        )}
      </div>

      {/* Info */}
      <div className="eg-info">
        <span className="eg-cat" style={{ color: "#3D47C8" }}>{ev.cat}</span>
        <h3 className="eg-title">{ev.title}</h3>
        <div className="eg-meta">
          <span className="eg-meta-row"><CalIcon/> {ev.dateShort}</span>
          <span className="eg-meta-row"><PinIcon/> {ev.venue}</span>
        </div>
      </div>
    </a>
  );
}

// ─── Fila horizontal con scroll ───────────────────────────────────────────────
function EventRow({ cat, events }) {
  const rowRef = useRef(null);
  const scroll = (dir) => {
    if (rowRef.current) rowRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (events.length === 0) return null;

  return (
    <div className="eg-row-section">
      <div className="eg-row-header">
        <div className="eg-row-label">
          <span className="eg-row-cat-dot" />
          <h2 className="eg-row-title">{cat}</h2>
          <span className="eg-row-count">{events.length} eventos</span>
        </div>
        <div className="eg-row-controls">
          <button className="eg-scroll-btn" onClick={() => scroll(-1)} aria-label="Anterior">
            <ChevronLeftIcon/>
          </button>
          <button className="eg-scroll-btn" onClick={() => scroll(1)} aria-label="Siguiente">
            <ChevronRightIcon/>
          </button>
        </div>
      </div>
      <div className="eg-row" ref={rowRef}>
        {events.map(ev => <EventCard key={ev.id} ev={ev}/>)}
      </div>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="eg-row-section">
      <div className="eg-row-header">
        <div className="eg-row-label">
          <div className="eg-skel" style={{ width: 120, height: 20, borderRadius: 4 }}/>
        </div>
      </div>
      <div className="eg-row" style={{ overflow: "hidden" }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="eg-card" style={{ flexShrink: 0, pointerEvents: "none" }}>
            <div className="eg-img-wrap">
              <div className="eg-skel" style={{ width: "100%", height: "100%", borderRadius: 0 }}/>
            </div>
            <div className="eg-info">
              <div className="eg-skel" style={{ width: "40%", height: 10 }}/>
              <div className="eg-skel" style={{ width: "90%", height: 16, margin: "6px 0" }}/>
              <div className="eg-skel" style={{ width: "60%", height: 10 }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const css = `
  .eg-wrap {
    background: #F2F0E6;
    padding: 4rem 0 5rem;
    border-top: 1.5px solid #1A237E;
  }
  .eg-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Cabecera sección */
  .eg-section-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 1.5px solid #1A237E;
    padding-bottom: 1.25rem;
    margin-bottom: 2.5rem;
  }
  .eg-section-label {
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #3D47C8;
    margin-bottom: .35rem;
    font-family: 'DM Sans', sans-serif;
  }
  .eg-section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2.25rem;
    letter-spacing: -.025em;
    color: #1A237E;
    line-height: 1.05;
  }
  .eg-api-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(61,71,200,.25);
    border-radius: 3px;
    padding: .4rem .875rem;
    font-size: .72rem;
    color: rgba(26,35,126,.55);
    font-family: 'DM Sans', sans-serif;
  }
  .eg-api-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #3D47C8;
    animation: egpulse 2s infinite;
    flex-shrink: 0;
  }
  @keyframes egpulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  /* Filtros de categoría */
  .eg-filters {
    display: flex;
    gap: .375rem;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
  }
  .eg-fbtn {
    padding: .38rem 1rem;
    border: 1.5px solid #1A237E;
    border-radius: 2px;
    background: transparent;
    color: #1A237E;
    font-family: 'DM Sans', sans-serif;
    font-size: .75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all .12s;
  }
  .eg-fbtn:hover { background: #1A237E; color: #C9D11A; }
  .eg-fbtn.active { background: #C9D11A; color: #1A237E; border-color: #b8c016; font-weight: 700; }

  /* Fila por categoría */
  .eg-row-section { margin-bottom: 3rem; }
  .eg-row-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 0 .25rem;
  }
  .eg-row-label { display: flex; align-items: center; gap: .75rem; }
  .eg-row-cat-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #C9D11A;
    border: 2px solid #1A237E;
    flex-shrink: 0;
  }
  .eg-row-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: #1A237E;
    margin: 0;
  }
  .eg-row-count {
    font-size: .7rem;
    color: rgba(26,35,126,.4);
    font-family: 'DM Sans', sans-serif;
    letter-spacing: .05em;
  }
  .eg-row-controls { display: flex; gap: .375rem; }
  .eg-scroll-btn {
    width: 32px; height: 32px;
    border: 1.5px solid #1A237E;
    border-radius: 2px;
    background: transparent;
    color: #1A237E;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all .12s;
    padding: 0;
  }
  .eg-scroll-btn:hover { background: #1A237E; color: #C9D11A; }

  /* Fila horizontal */
  .eg-row {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .75rem;
    scrollbar-width: none;
  }
  .eg-row::-webkit-scrollbar { display: none; }

  /* Tarjeta */
  .eg-card {
    flex-shrink: 0;
    width: 260px;
    border-radius: 6px;
    overflow: hidden;
    border: 1.5px solid #1A237E;
    background: #F2F0E6;
    scroll-snap-align: start;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    transition: transform .2s, box-shadow .2s;
    cursor: pointer;
  }
  .eg-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(26,35,126,.18);
  }

  /* Imagen */
  .eg-img-wrap {
    position: relative;
    width: 100%;
    height: 160px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .eg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform .35s ease;
    display: block;
  }
  .eg-card:hover .eg-img { transform: scale(1.07); }

  .eg-img-fallback {
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 1rem;
    gap: .375rem;
    transition: filter .35s;
  }
  .eg-card:hover .eg-img-fallback { filter: brightness(1.08); }
  .eg-fallback-cat {
    font-family: 'DM Sans', sans-serif;
    font-size: .65rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .eg-fallback-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: .95rem;
    color: #fff;
    line-height: 1.2;
  }

  /* Badges sobre imagen */
  .eg-price-badge {
    position: absolute;
    top: .625rem;
    right: .625rem;
  }
  .eg-badge-free {
    background: #C9D11A;
    color: #1A237E;
    font-size: .65rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: .04em;
    text-transform: uppercase;
  }
  .eg-badge-price {
    background: #1A237E;
    color: #C9D11A;
    font-size: .65rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
  }
  .eg-access-badge {
    position: absolute;
    bottom: .5rem;
    left: .5rem;
    background: rgba(26,35,126,.85);
    color: #C9D11A;
    font-size: .6rem;
    font-weight: 600;
    padding: 3px 7px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    gap: 3px;
    font-family: 'DM Sans', sans-serif;
    backdrop-filter: blur(4px);
  }

  /* Info */
  .eg-info { padding: .875rem 1rem 1rem; display: flex; flex-direction: column; gap: .3rem; flex: 1; }
  .eg-cat {
    font-size: .65rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
  }
  .eg-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: .95rem;
    color: #1A237E;
    line-height: 1.25;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .eg-meta { display: flex; flex-direction: column; gap: 3px; margin-top: auto; padding-top: .5rem; }
  .eg-meta-row {
    display: flex; align-items: center; gap: 4px;
    font-size: .7rem;
    color: rgba(26,35,126,.5);
    font-family: 'DM Sans', sans-serif;
  }

  /* Skeleton */
  .eg-skel {
    background: linear-gradient(90deg, #E8E6D8 25%, #F2F0E6 50%, #E8E6D8 75%);
    background-size: 200%;
    animation: egskel 1.4s infinite;
    border-radius: 2px;
    margin-bottom: .5rem;
  }
  @keyframes egskel { 0%{background-position:200% 0}100%{background-position:-200% 0} }

  /* Notice CORS */
  .eg-notice {
    margin-bottom: 1.5rem;
    padding: .5rem 1rem;
    background: rgba(61,71,200,.07);
    border-left: 3px solid #3D47C8;
    font-size: .75rem;
    color: rgba(26,35,126,.65);
    border-radius: 0 3px 3px 0;
    font-family: 'DM Sans', sans-serif;
  }

  @media (max-width: 768px) {
    .eg-section-head { flex-direction: column; align-items: flex-start; gap: .75rem; }
    .eg-card { width: 220px; }
    .eg-img-wrap { height: 130px; }
  }
`;

// ─── Componente principal ─────────────────────────────────────────────────────
export default function EventsGrid() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { byCategory, loading, fromApi, total } = useEvents(activeCategory);

  // Categorías que tienen eventos
  const catsWithEvents = loading
    ? CATEGORIES.slice(1)
    : CATEGORIES.slice(1).filter(c => byCategory(c).length > 0);

  const visibleCats = activeCategory === "Todos" ? catsWithEvents : [activeCategory];

  return (
    <>
      <style>{css}</style>
      <section className="eg-wrap">
        <div className="eg-inner">

          {/* Cabecera */}
          <div className="eg-section-head">
            <div>
              <div className="eg-section-label">Cartelera</div>
              <h2 className="eg-section-title">Eventos en Madrid</h2>
            </div>
            {fromApi && (
              <div className="eg-api-badge">
                <span className="eg-api-dot"/>
                {total} eventos · API Ayuntamiento Madrid
              </div>
            )}
          </div>

          {/* Aviso si es data local */}
          {!loading && !fromApi && (
            <div className="eg-notice">
              Mostrando eventos de muestra. En producción con tu backend Laravel se cargan desde la API real del Ayuntamiento.
            </div>
          )}

          {/* Filtros */}
          <div className="eg-filters">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`eg-fbtn${activeCategory === c ? " active" : ""}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Filas por categoría */}
          {loading ? (
            <>
              <SkeletonRow/>
              <SkeletonRow/>
              <SkeletonRow/>
            </>
          ) : (
            visibleCats.map(cat => (
              <EventRow
                key={cat}
                cat={cat}
                events={byCategory(cat)}
              />
            ))
          )}

        </div>
      </section>
    </>
  );
}