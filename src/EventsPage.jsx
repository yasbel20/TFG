import { useState, useEffect, useRef } from "react";

// ─── Reutilizamos parseEvent y SAMPLE del proyecto ────────────────────────────
const CAT_COLORS = {
  "Música":     "#1A1A1A",
  "Teatro":     "#141414",
  "Exposición": "#181818",
  "Cine":       "#1A1A1A",
  "Danza":      "#141414",
  "Cultura":    "#111111",
  "Deporte":    "#1A1A1A",
};

const CATEGORIES = ["Todos", "Música", "Teatro", "Exposición", "Cine", "Danza", "Cultura"];

// ─── Imágenes hero por categoría (Unsplash, libres) ─────────────────────────
const CAT_HERO = {
  "Música":     "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&q=80",
  "Teatro":     "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1400&q=80",
  "Exposición": "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1400&q=80",
  "Cine":       "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=80",
  "Danza":      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1400&q=80",
  "Cultura":    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1400&q=80",
  "Deporte":    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&q=80",
  "Todos":      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80",
};
// ─── Iconos ───────────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);
const WheelIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2"/><path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z"/>
    <path d="M6 16a6 6 0 1 0 12 0" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const SignosIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 9v5h2v7h4v-7h2V9H3zm14 0v5h2v7h4v-7h2V9h-8z"/>
  </svg>
);
const BucleIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm-1-9v5l4-2.5L11 10z"/>
  </svg>
);
const PodoIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

// ─── Parser ───────────────────────────────────────────────────────────────────
// ─── Parser idéntico al de EventsGrid ────────────────────────────────────────
function parseEvent(item, i) {
  const desc = ((item.description || "") + " " + (item.organization?.["organization-name"] || "")).toLowerCase();
  const t = (item.title || "").toLowerCase();
  let cat = "Cultura";
  if (/concierto|música|jazz|flamenco|rock|pop|música/.test(t + desc)) cat = "Música";
  else if (/teatro|obra|danza|ballet|ópera/.test(t + desc))            cat = "Teatro";
  else if (/exposici|muestra|exhibit|galería/.test(t + desc))          cat = "Exposición";
  else if (/cine|film|pelícu/.test(t + desc))                          cat = "Cine";
  else if (/danza|baile|flamenco/.test(t + desc))                      cat = "Danza";
  else if (/deporte|sport|carrera|maratón/.test(t + desc))             cat = "Deporte";

  // Campo real confirmado: item.organization["accesibility"] (typo oficial del Ayuntamiento)
  const accRaw = item.organization?.["accesibility"] || "";
  const codes  = accRaw.toString().split(",").map(c => c.trim()).filter(Boolean);
  const access = [];
  if (codes.includes("1") || codes.includes("2")) access.push("silla");
  if (codes.includes("4"))                         access.push("signos");
  if (codes.includes("5"))                         access.push("braille");
  if (codes.includes("6"))                         access.push("bucle");
  // códigos 0 y 3 → access queda vacío → evento se filtra fuera

  let price = "Gratis";
  const fee = item["event-free"] ?? item.free;
  if (fee === false || fee === "false" || fee === 0 || fee === "0") {
    const raw = String(item["event-fee"] || item.price || "").trim();
    price = /^\d+([.,]\d+)?$/.test(raw) ? `Desde ${raw.replace(",", ".")} €` : "Ver precio";
  }

  let dateShort = "Consultar";
  if (item.dtstart) {
    const s = new Date(item.dtstart);
    const e = item.dtend ? new Date(item.dtend) : null;
    const fmt = { day: "numeric", month: "short" };
    dateShort = s.toLocaleDateString("es-ES", fmt).toUpperCase();
    if (e && e.toDateString() !== s.toDateString())
      dateShort = `${s.toLocaleDateString("es-ES", fmt)} – ${e.toLocaleDateString("es-ES", fmt)}`.toUpperCase();
  }

  let image = null;
  if (item.media?.["@id"])   image = item.media["@id"];
  else if (item.image)       image = item.image;
  else if (item.media?.url)  image = item.media.url;

  const venue = item.location?.["street-address"]
    || item.organization?.["organization-name"]
    || item["event-location"]?.["@id"]
    || "Madrid";

  return {
    id:       item.id || `ev-${i}`,
    title:    item.title || "Evento sin título",
    cat, dateShort, price, access, image,
    url:      item.link || "#",
    venue:    venue.length > 40 ? venue.slice(0, 38) + "…" : venue,
    district: item.address?.["locality"] || "Madrid",
    desc:     (item.description || "").replace(/<[^>]+>/g, "").slice(0, 120),
  };
}

// ─── Datos de muestra idénticos a EventsGrid ─────────────────────────────────
const SAMPLE = [
  { id:1, title:"Jazz en el Conde Duque",       cat:"Música",     dateShort:"12 ABR",       venue:"C.C. Conde Duque",        district:"Centro",   price:"Gratis",    access:["silla","signos"], image:null, url:"#" },
  { id:2, title:"Picasso: Miradas múltiples",   cat:"Exposición", dateShort:"HASTA 30 ABR", venue:"Museo Reina Sofía",       district:"Atocha",   price:"12 €",      access:["silla","audio"],  image:null, url:"#" },
  { id:3, title:"La Casa de Bernarda Alba",     cat:"Teatro",     dateShort:"18–20 ABR",    venue:"Teatro Español",          district:"Centro",   price:"15 €",      access:["subtitulos"],     image:null, url:"#" },
  { id:4, title:"Cine: Todo sobre mi madre",    cat:"Cine",       dateShort:"15 ABR",       venue:"Filmoteca Española",      district:"Lavapiés", price:"3 €",       access:["audio"],          image:null, url:"#" },
  { id:5, title:"Concierto flamenco accesible", cat:"Música",     dateShort:"20 ABR",       venue:"Café de las Artes",       district:"Malasaña", price:"10 €",      access:["silla"],          image:null, url:"#" },
  { id:6, title:"Feria del Libro de Madrid",    cat:"Cultura",    dateShort:"24 ABR–1 MAY", venue:"Parque del Retiro",       district:"Retiro",   price:"Gratis",    access:["silla"],          image:null, url:"#" },
  { id:7, title:"Noche de Danza Contemporánea", cat:"Danza",      dateShort:"22 ABR",       venue:"Teatro del Canal",        district:"Chamberí", price:"18 €",      access:["silla","signos"], image:null, url:"#" },
  { id:8, title:"Exposición: Carteles Madrid",  cat:"Exposición", dateShort:"TODO ABR",     venue:"Círculo de Bellas Artes", district:"Centro",   price:"Gratis",    access:["silla"],          image:null, url:"#" },
];

// ─── Hook idéntico al de EventsGrid ──────────────────────────────────────────
function useEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const API = "/api-madrid/egob/catalogo/206974-0-agenda-eventos-culturales-100.json";
    fetch(API)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const all    = (data["@graph"] || []).map(parseEvent);
        const parsed = all.filter(e => e.access.length > 0);
        const porCat = {};
        parsed.forEach(e => { porCat[e.cat] = (porCat[e.cat] || 0) + 1; });
        console.log(`[EventsPage] total API: ${all.length} | accesibles: ${parsed.length}`, porCat);
        setAllEvents(parsed);
        setLoading(false);
      })
      .catch(() => {
        setAllEvents(SAMPLE);
        setLoading(false);
      });
  }, []);

  const byCategory = (cat) =>
    cat === "Todos" ? allEvents : allEvents.filter(e => e.cat === cat);

  return { byCategory, loading, total: allEvents.length };
}

// ─── Tarjeta idéntica a EventsGrid ───────────────────────────────────────────
function GridCard({ ev }) {
  const colors = CAT_COLORS[ev.cat] || CAT_COLORS["Cultura"];
  const [imgOk, setImgOk] = useState(!!ev.image);

  return (
    <a
      className="ep-card"
      href={ev.url !== "#" ? ev.url : undefined}
      target={ev.url !== "#" ? "_blank" : undefined}
      rel="noreferrer"
      aria-label={ev.title}
    >
      <div className="ep-img-wrap">
        {ev.image && imgOk ? (
          <img src={ev.image} alt={ev.title} className="ep-img" onError={() => setImgOk(false)} loading="lazy"/>
        ) : (
          <div className="ep-img-fallback" style={{ background: colors.bg }}>
            <div className="ep-fallback-pattern"/>
          </div>
        )}
      </div>
      <div className="ep-info">
        <span className="ep-cat">{ev.cat}</span>
        <h3 className="ep-title">{ev.title}</h3>
        {ev.access.length > 0 && (
          <div className="ep-access-badges">
            {ev.access.includes("silla")  && <span className="ep-access-chip"><WheelIcon/> PMR</span>}
            {ev.access.includes("signos") && <span className="ep-access-chip"><SignosIcon/> Signos</span>}
            {ev.access.includes("bucle")  && <span className="ep-access-chip"><BucleIcon/> Bucle</span>}
            {ev.access.includes("braille")&& <span className="ep-access-chip"><PodoIcon/> Podotáctil</span>}
          </div>
        )}
        <div className="ep-meta-block">
          <span className="ep-meta-row ep-meta-date"><CalendarIcon/> {ev.dateShort}</span>
          <span className="ep-meta-row ep-meta-venue"><PinIcon/> {ev.venue}</span>
        </div>
        <div className="ep-bottom-row">
          {ev.price === "Gratis"
            ? <span className="ep-price-free">Gratis</span>
            : <span className="ep-price-paid">{ev.price}</span>
          }
        </div>
      </div>
    </a>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="ep-card" style={{ pointerEvents: "none" }}>
      <div className="ep-img-wrap">
        <div className="ep-skel" style={{ width: "100%", height: "100%", borderRadius: 0 }}/>
      </div>
      <div className="ep-info">
        <div className="ep-skel" style={{ width: "40%", height: 10 }}/>
        <div className="ep-skel" style={{ width: "90%", height: 16, margin: "6px 0" }}/>
        <div className="ep-skel" style={{ width: "60%", height: 10 }}/>
      </div>
    </div>
  );
}

// ─── Nav Header (igual que home) ─────────────────────────────────────────────
const EP_CATS_ALL = ["Todos los eventos", "Música", "Teatro", "Exposición", "Cine", "Danza", "Cultura"];

const ChevronDownIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

function EventsDropdownNav({ activeCategory, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="ep-nav-dropdown-wrap" ref={ref}>
      <button
        className={`ep-nav-link ep-nav-link--arrow${open ? " ep-nav-active" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        Eventos <ChevronDownIcon/>
      </button>
      {open && (
        <div className="ep-nav-dropdown">
          {EP_CATS_ALL.map(cat => (
            <button
              key={cat}
              className="ep-nav-dropdown-item"
              onClick={() => { setOpen(false); onSelect(cat === "Todos los eventos" ? "Todos" : cat); }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function EventsPage({ initialCategory = "Todos", onBack }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { byCategory, loading } = useEvents();
  const ref = useRef(null);

  const filtered = byCategory(activeCategory);

  const catLabel = activeCategory === "Todos" ? "Todos los eventos" : activeCategory;

  return (
    <>
      <style>{css}</style>
      <div className="ep-page">

        {/* ── NAV HEADER ── */}
        <header>
          <nav className="ep-nav" aria-label="Navegación principal">
            <button className="ep-nav-logo" onClick={onBack} aria-label="INCLUGO — ir al inicio">
              INCLU<em>GO</em>
            </button>
            <ul className="ep-nav-links" role="list">
              <li>
                <EventsDropdownNav activeCategory={activeCategory} onSelect={setActiveCategory} />
              </li>
              <li><button className="ep-nav-link">Accesibilidad</button></li>
              <li><button className="ep-nav-link">Acerca de</button></li>
            </ul>
            <button className="ep-nav-cta" onClick={onBack}>
              Volver
            </button>
          </nav>
        </header>

        {/* ── Foto categoría (sin texto encima) ── */}
        <div
          className="ep-cat-photo"
          style={{ backgroundImage: `url(${CAT_HERO[activeCategory] || CAT_HERO["Todos"]})` }}
        >
          <div className="ep-cat-photo-overlay"/>
          <div className="ep-cat-photo-label">
            <h1 className="ep-header-title">{catLabel}</h1>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="ep-body">
          <div className="ep-grid">
            {loading
              ? Array.from({length: 12}).map((_, i) => <SkeletonCard key={i}/>)
              : filtered.length === 0
                ? <p className="ep-empty">No hay eventos en esta categoría.</p>
                : filtered.map(ev => <GridCard key={ev.id} ev={ev}/>)
            }
          </div>
        </div>

      </div>
    </>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');

  .ep-page {
    min-height: 100vh;
    background: #F7F7F5;
    font-family: 'Inter', sans-serif;
  }

  /* ── NAV (igual que home) ── */
  .ep-nav {
    width: 100%;
    background: #ffffff;
    border-bottom: 1.5px solid #111111;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(1.25rem, 5vw, 6rem);
    height: 72px;
    position: sticky; top: 0; z-index: 300;
  }
  .ep-nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.8rem, 3.5vw, 2.4rem);
    letter-spacing: .06em;
    color: #111111;
    background: none; border: none; cursor: pointer; padding: 0;
    line-height: 1;
  }
  .ep-nav-logo em { color: #333333; font-style: normal; }
  .ep-nav-links {
    display: flex; gap: clamp(1.5rem, 3vw, 3rem);
    list-style: none; margin: 0; padding: 0;
  }
  .ep-nav-link {
    font-size: .78rem; font-weight: 600;
    color: #555555;
    background: none; border: none; cursor: pointer;
    letter-spacing: .12em; text-transform: uppercase;
    padding: .75rem 0; min-height: 44px;
    display: inline-flex; align-items: center; gap: 5px;
    transition: color .15s;
  }
  .ep-nav-link:hover, .ep-nav-active { color: #111111; }
  .ep-nav-cta {
    background: #111111; color: #fff;
    border: none;
    padding: .625rem 1.5rem; min-height: 44px;
    font-size: .78rem; font-weight: 700; cursor: pointer;
    letter-spacing: .1em; text-transform: uppercase;
    font-family: 'Inter', sans-serif;
    transition: background .15s;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }
  .ep-nav-cta:hover { background: #333333; }

  /* Nav dropdown */
  .ep-nav-dropdown-wrap { position: relative; }
  .ep-nav-link--arrow { gap: 5px; }
  .ep-nav-dropdown {
    position: absolute; top: calc(100% + 4px); left: 0;
    background: #111111;
    min-width: 200px;
    z-index: 400;
    display: flex; flex-direction: column;
    padding: .4rem 0;
    box-shadow: 0 8px 24px rgba(0,0,0,.18);
  }
  .ep-nav-dropdown-item {
    background: none; border: none; cursor: pointer;
    color: #aaaaaa;
    font-family: 'Inter', sans-serif;
    font-size: .7rem; font-weight: 600;
    letter-spacing: .1em;
    padding: .6rem 1.2rem;
    text-align: left;
    transition: color .12s, background .12s;
  }
  .ep-nav-dropdown-item:hover { color: #ffffff; background: rgba(255,255,255,.06); }

  /* ── Foto de categoría ── */
  .ep-cat-photo {
    position: relative;
    width: 100%;
    height: 380px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-image .3s;
  }
  .ep-cat-photo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,.3) 0%,
      rgba(0,0,0,.6) 60%,
      rgba(0,0,0,.85) 100%
    );
  }
  .ep-cat-photo-label {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 1.75rem clamp(1.25rem, 5vw, 6rem) 2rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }

  .ep-header-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 400;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #ffffff;
    margin: 0;
    line-height: 1;
  }
  .ep-api-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 2px;
    padding: .4rem .875rem;
    font-size: .7rem;
    color: rgba(255,255,255,.5);
    white-space: nowrap;
    flex-shrink: 0;
    font-family: 'Inter', sans-serif;
  }
  .ep-api-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #4ade80;
    animation: eppulse 2s infinite;
    flex-shrink: 0;
  }
  @keyframes eppulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  /* ── Filtros bar sticky ── */
  .ep-filters-bar {
    background: #111111;
    position: sticky;
    top: 72px;
    z-index: 10;
    border-bottom: 1px solid #222222;
  }
  .ep-filters-inner {
    width: 100%;
    padding: 0 clamp(1.25rem, 5vw, 6rem);
  }
  .ep-filters {
    display: flex;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ep-filters::-webkit-scrollbar { display: none; }
  .ep-fbtn {
    padding: .85rem 1.4rem;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: #666666;
    font-family: 'Inter', sans-serif;
    font-size: .8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all .15s;
    letter-spacing: .03em;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .ep-fbtn:hover { color: #ffffff; }
  .ep-fbtn.active {
    color: #ffffff;
    border-bottom-color: #ffffff;
    font-weight: 700;
  }

  /* ── Body / Grid ── */
  .ep-body {
    width: 100%;
    padding: 2.5rem clamp(1.25rem, 5vw, 6rem) 5rem;
  }
  .ep-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.75rem 1.5rem;
  }
  .ep-empty {
    grid-column: 1/-1;
    text-align: center;
    color: #999999;
    font-size: .9rem;
    padding: 4rem 0;
  }

  /* ── Tarjeta ── */
  .ep-card {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    cursor: pointer;
    transition: transform .2s;
    border: none;
    background: transparent;
    overflow: visible;
  }
  .ep-card:hover { transform: translateY(-4px); }

  /* Imagen */
  .ep-img-wrap {
    position: relative;
    width: 100%;
    height: 290px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .ep-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform .35s ease;
    display: block;
  }
  .ep-card:hover .ep-img { transform: scale(1.04); }
  .ep-img-fallback {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter .35s;
  }
  .ep-card:hover .ep-img-fallback { filter: brightness(1.1); }
  .ep-fallback-pattern {
    width: 100%; height: 100%;
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 18px,
      rgba(255,255,255,.04) 18px,
      rgba(255,255,255,.04) 19px
    );
  }

  /* Info debajo */
  .ep-info {
    padding: .75rem 0 .5rem;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .ep-cat {
    font-family: 'Inter', sans-serif;
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #999999;
    margin-bottom: .3rem;
  }
  .ep-title {
    font-family: 'Bebas Neue', sans-serif;
    font-weight: 400;
    font-size: 1.2rem;
    letter-spacing: .03em;
    color: #111111;
    line-height: 1.15;
    margin: 0 0 .5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .ep-meta-block {
    display: flex;
    flex-direction: column;
    gap: .18rem;
    margin-bottom: .5rem;
  }
  .ep-meta-row {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: .67rem;
    font-family: 'Inter', sans-serif;
    color: #888888;
  }
  .ep-meta-date { color: #555555; font-weight: 600; }
  .ep-meta-venue { color: #999999; }
  .ep-bottom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: .4rem;
    border-top: 1px solid #EBEBEB;
  }
  .ep-price-free {
    font-family: 'Inter', sans-serif;
    font-size: .65rem;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #111111;
  }
  .ep-price-paid {
    font-family: 'Inter', sans-serif;
    font-size: .65rem;
    font-weight: 700;
    color: #111111;
  }
  .ep-access-badges {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: .45rem;
  }
  .ep-access-chip {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-family: 'Inter', sans-serif;
    font-size: .62rem;
    font-weight: 500;
    color: #888888;
    line-height: 1;
  }

  /* Skeleton */
  .ep-skel {
    background: linear-gradient(90deg, #EBEBEB 25%, #F5F5F5 50%, #EBEBEB 75%);
    background-size: 200%;
    animation: epskel 1.4s infinite;
    border-radius: 2px;
    margin-bottom: .5rem;
  }
  @keyframes epskel { 0%{background-position:200% 0}100%{background-position:-200% 0} }

  /* Responsive */
  @media (max-width: 768px) {
    .ep-nav-links { display: none; }
    .ep-cat-photo { height: 280px; }
    .ep-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem .75rem; }
    .ep-img-wrap { height: 220px; }
  }
  @media (max-width: 420px) {
    .ep-grid { grid-template-columns: 1fr; }
  }
`;