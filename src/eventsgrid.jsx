import { useState, useEffect, useRef } from "react";

// ─── Categorías y colores ─────────────────────────────────────────────────────
const CAT_COLORS = {
  "Música":     { bg: "#1A1A1A" },
  "Teatro":     { bg: "#141414" },
  "Exposición": { bg: "#111111" },
  "Cine":       { bg: "#1A1A1A" },
  "Danza":      { bg: "#141414" },
  "Cultura":    { bg: "#111111" },
  "Deporte":    { bg: "#1A1A1A" },
};

const CATEGORIES = ["Todos", "Música", "Teatro", "Exposición", "Cine", "Danza", "Cultura"];

// ─── Iconos ───────────────────────────────────────────────────────────────────
const CalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);
const WheelIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="2"/><path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z"/>
    <path d="M6 16a6 6 0 1 0 12 0" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const SignosIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 9v5h2v7h4v-7h2V9H3zm14 0v5h2v7h4v-7h2V9h-8z"/>
  </svg>
);
const BucleIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm-1-9v5l4-2.5L11 10z"/>
  </svg>
);
const PodoIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

// ─── Parser: extrae TODOS los campos útiles de la API ─────────────────────────
function parseEvent(item, i) {
  const desc = ((item.description || "") + " " + (item.organization?.["organization-name"] || "")).toLowerCase();
  const t = (item.title || "").toLowerCase();

  let cat = "Cultura";
  if (/concierto|música|jazz|flamenco|rock|pop/.test(t + desc))  cat = "Música";
  else if (/teatro|obra|ballet|ópera/.test(t + desc))            cat = "Teatro";
  else if (/exposici|muestra|exhibit|galería/.test(t + desc))    cat = "Exposición";
  else if (/cine|film|pelícu/.test(t + desc))                    cat = "Cine";
  else if (/danza|baile/.test(t + desc))                         cat = "Danza";
  else if (/deporte|sport|carrera|maratón/.test(t + desc))       cat = "Deporte";

  const accRaw = item.organization?.["accesibility"] || "";
  const codes  = accRaw.toString().split(",").map(c => c.trim()).filter(Boolean);
  const access = [];
  if (codes.includes("1") || codes.includes("2")) access.push("silla");
  if (codes.includes("4"))                         access.push("signos");
  if (codes.includes("5"))                         access.push("braille");
  if (codes.includes("6"))                         access.push("bucle");

  let price = "Gratis";
  const fee = item["event-free"] ?? item.free;
  if (fee === false || fee === "false" || fee === 0 || fee === "0") {
    const raw = String(item["event-fee"] || item.price || "").trim();
    price = /^\d+([.,]\d+)?$/.test(raw) ? `Desde ${raw.replace(",", ".")} €` : "Ver precio";
  }

  let date = "Consultar fecha";
  let dateShort = "Consultar";
  let timeStr = "";
  if (item.dtstart) {
    const s = new Date(item.dtstart);
    const e = item.dtend ? new Date(item.dtend) : null;
    const fmt     = { day: "numeric", month: "short" };
    const fmtFull = { day: "numeric", month: "long", year: "numeric" };
    dateShort = s.toLocaleDateString("es-ES", fmt).toUpperCase();
    date = s.toLocaleDateString("es-ES", fmtFull);
    if (e && e.toDateString() !== s.toDateString()) {
      dateShort = `${s.toLocaleDateString("es-ES", fmt)} – ${e.toLocaleDateString("es-ES", fmt)}`.toUpperCase();
      date = `${date} – ${e.toLocaleDateString("es-ES", fmtFull)}`;
    }
    const h = s.getHours(), m = s.getMinutes();
    if (h !== 0 || m !== 0)
      timeStr = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} h`;
  }

  let image = null;
  if (item.media?.["@id"])  image = item.media["@id"];
  else if (item.image)      image = item.image;
  else if (item.media?.url) image = item.media.url;

  const venue = item.location?.["street-address"]
    || item.organization?.["organization-name"]
    || "Madrid";

  // Descripción COMPLETA de la API, sin recortar
  const descFull = (item.description || "").replace(/<[^>]+>/g, "").trim();

  return {
    id:        item.id || `ev-${i}`,
    title:     item.title || "Evento sin título",
    cat,
    date,
    dateShort,
    timeStr,
    venue:     venue.length > 40 ? venue.slice(0, 38) + "…" : venue,
    venueRaw:  venue,
    district:  item.address?.["locality"] || "Madrid",
    price,
    access,
    image,
    url:       item.link || "#",
    descFull,  // ← descripción completa sin límite
    org:       item.organization?.["organization-name"] || "",
  };
}

// ─── Datos de muestra ─────────────────────────────────────────────────────────
const SAMPLE = [
  { id:1, title:"Jazz en el Conde Duque",       cat:"Música",     dateShort:"12 ABR",       date:"12 de abril de 2026",  timeStr:"20:00 h", venue:"C.C. Conde Duque",        venueRaw:"C.C. Conde Duque",        district:"Centro",   price:"Gratis", access:["silla","signos"], image:null, url:"#", org:"Área de Cultura Madrid",      descFull:"Una noche de jazz en vivo en el emblemático Centro Cultural Conde Duque. Artistas internacionales y nacionales se unen para ofrecer una experiencia musical única en uno de los espacios culturales más importantes de Madrid." },
  { id:2, title:"Picasso: Miradas múltiples",   cat:"Exposición", dateShort:"HASTA 30 ABR", date:"Hasta 30 de abril",    timeStr:"",        venue:"Museo Reina Sofía",       venueRaw:"Museo Reina Sofía",       district:"Atocha",   price:"12 €",   access:["silla","bucle"],  image:null, url:"#", org:"Museo Nacional Reina Sofía",  descFull:"Exposición temporal que reúne más de 150 obras del maestro malagueño, explorando las distintas etapas de su prolífica carrera artística, desde el cubismo hasta sus últimas creaciones." },
  { id:3, title:"La Casa de Bernarda Alba",     cat:"Teatro",     dateShort:"18–20 ABR",   date:"18 al 20 de abril",    timeStr:"19:30 h", venue:"Teatro Español",          venueRaw:"Teatro Español",          district:"Centro",   price:"15 €",   access:["signos"],         image:null, url:"#", org:"Teatro Español",              descFull:"La obra cumbre de Federico García Lorca en una producción contemporánea. Una mirada actual a la opresión, el deseo y la libertad en la España rural." },
  { id:4, title:"Cine: Todo sobre mi madre",    cat:"Cine",       dateShort:"15 ABR",       date:"15 de abril de 2026",  timeStr:"18:00 h", venue:"Filmoteca Española",      venueRaw:"Filmoteca Española",      district:"Lavapiés", price:"3 €",    access:["bucle"],          image:null, url:"#", org:"Filmoteca Española",          descFull:"Ciclo Almodóvar. Proyección de la ganadora del Oscar a Mejor Película Extranjera en versión original con subtítulos en español." },
  { id:5, title:"Concierto flamenco accesible", cat:"Música",     dateShort:"20 ABR",       date:"20 de abril de 2026",  timeStr:"21:00 h", venue:"Café de las Artes",       venueRaw:"Café de las Artes",       district:"Malasaña", price:"10 €",   access:["silla"],          image:null, url:"#", org:"",                            descFull:"Noche de flamenco auténtico con artistas del barrio en un espacio completamente accesible. La esencia del flamenco más puro en el corazón de Malasaña." },
  { id:6, title:"Feria del Libro de Madrid",    cat:"Cultura",    dateShort:"24 ABR–1 MAY", date:"24 abril al 1 mayo",   timeStr:"",        venue:"Parque del Retiro",       venueRaw:"Parque del Retiro",       district:"Retiro",   price:"Gratis", access:["silla"],          image:null, url:"#", org:"Cámara del Libro",            descFull:"La cita anual más importante del sector editorial en España. Más de 350 casetas con libros de todos los géneros, firmas de autores y actividades para todas las edades." },
  { id:7, title:"Noche de Danza Contemporánea", cat:"Danza",      dateShort:"22 ABR",       date:"22 de abril de 2026",  timeStr:"20:30 h", venue:"Teatro del Canal",        venueRaw:"Teatro del Canal",        district:"Chamberí", price:"18 €",   access:["silla","signos"], image:null, url:"#", org:"Teatro del Canal",            descFull:"Una velada de danza contemporánea con compañías emergentes del panorama nacional e internacional. El movimiento como lenguaje universal." },
  { id:8, title:"Exposición: Carteles Madrid",  cat:"Exposición", dateShort:"TODO ABR",     date:"Todo abril",           timeStr:"",        venue:"Círculo de Bellas Artes",  venueRaw:"Círculo de Bellas Artes", district:"Centro",  price:"Gratis", access:["silla"],          image:null, url:"#", org:"Círculo de Bellas Artes",     descFull:"Colección de los carteles más icónicos de la historia de Madrid, desde el siglo XIX hasta la actualidad. Un recorrido visual por la identidad gráfica de la ciudad." },
];

// ─── Hook de datos ────────────────────────────────────────────────────────────
function useEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [fromApi, setFromApi]     = useState(false);

  useEffect(() => {
    const API = "/api-madrid/egob/catalogo/206974-0-agenda-eventos-culturales-100.json";
    fetch(API)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const all    = (data["@graph"] || []).map(parseEvent);
        const parsed = all.filter(e => e.access.length > 0);
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

// ─── Tarjeta de evento ────────────────────────────────────────────────────────
function EventCard({ ev, onOpenDetail }) {
  const colors = CAT_COLORS[ev.cat] || { bg: "#111111" };
  const [imgOk, setImgOk] = useState(!!ev.image);

  return (
    <button
      className="eg-card"
      onClick={() => onOpenDetail(ev)}
      aria-label={`Ver detalle de ${ev.title}`}
    >
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
            <div className="eg-fallback-pattern"/>
          </div>
        )}
      </div>

      <div className="eg-info">
        <span className="eg-cat">{ev.cat}</span>
        <h3 className="eg-title">{ev.title}</h3>
        {ev.access.length > 0 && (
          <div className="eg-access-badges">
            {ev.access.includes("silla")   && <span className="eg-access-chip"><WheelIcon/> PMR</span>}
            {ev.access.includes("signos")  && <span className="eg-access-chip"><SignosIcon/> Signos</span>}
            {ev.access.includes("bucle")   && <span className="eg-access-chip"><BucleIcon/> Bucle</span>}
            {ev.access.includes("braille") && <span className="eg-access-chip"><PodoIcon/> Podotáctil</span>}
          </div>
        )}
        <div className="eg-meta-block">
          <span className="eg-meta-row eg-meta-date"><CalIcon/> {ev.dateShort}</span>
          <span className="eg-meta-row eg-meta-venue"><PinIcon/> {ev.venue}</span>
        </div>
        <div className="eg-bottom-row">
          {ev.price === "Gratis"
            ? <span className="eg-price-free">Gratis</span>
            : <span className="eg-price-paid">{ev.price}</span>
          }
        </div>
      </div>
    </button>
  );
}

// ─── Fila horizontal con scroll ───────────────────────────────────────────────
function EventRow({ cat, events, onOpenDetail }) {
  const rowRef = useRef(null);
  const scroll = (dir) => {
    if (rowRef.current) rowRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };
  if (events.length === 0) return null;

  return (
    <div className="eg-row-section">
      <div className="eg-row-header">
        <div className="eg-row-label">
          <span className="eg-row-cat-dot"/>
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
        {events.map(ev => (
          <EventCard key={ev.id} ev={ev} onOpenDetail={onOpenDetail}/>
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="eg-row-section" aria-hidden="true">
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
    background: #FFFFFF;
    padding: clamp(2.5rem, 6vw, 5rem) 0 clamp(3rem, 7vw, 6rem);
    border-top: 1.5px solid #111111;
    width: 100%;
  }
  .eg-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 clamp(1rem, 5vw, 4rem);
  }
  .eg-section-head {
    display: flex; align-items: flex-end; justify-content: space-between;
    border-bottom: 1.5px solid #111111; padding-bottom: 1.25rem; margin-bottom: 2.5rem;
  }
  .eg-section-label {
    font-size: .68rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: #555555; margin-bottom: .35rem;
    font-family: 'Inter', sans-serif;
  }
  .eg-section-title {
    font-family: 'Bebas Neue', sans-serif; font-weight: 400;
    font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: .04em; color: #111111; line-height: 1;
  }
  .eg-api-badge {
    display: inline-flex; align-items: center; gap: 6px;
    border: 1px solid #CCCAC0; border-radius: 2px; padding: .4rem .875rem;
    font-size: .72rem; color: #555555; font-family: 'Inter', sans-serif;
  }
  .eg-api-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #111111;
    animation: egpulse 2s infinite; flex-shrink: 0;
  }
  @keyframes egpulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  .eg-filters { display: flex; gap: .375rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
  .eg-fbtn {
    padding: .38rem 1rem; border: 1.5px solid #CCCAC0; border-radius: 2px;
    background: transparent; color: #555555; font-family: 'Inter', sans-serif;
    font-size: .75rem; font-weight: 500; cursor: pointer; transition: all .12s;
  }
  .eg-fbtn:hover { background: #111111; color: #F2F0E6; border-color: #111111; }
  .eg-fbtn.active { background: #111111; color: #F2F0E6; border-color: #111111; font-weight: 700; }
  .eg-fbtn:focus-visible { outline: 2px solid #C9D11A; outline-offset: 2px; }

  .eg-row-section { margin-bottom: 3rem; }
  .eg-row-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1rem; padding: 0 .25rem;
  }
  .eg-row-label { display: flex; align-items: center; gap: .75rem; }
  .eg-row-cat-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #111111; border: 2px solid #111111; flex-shrink: 0;
  }
  .eg-row-title {
    font-family: 'Bebas Neue', sans-serif; font-weight: 400;
    font-size: 1.3rem; letter-spacing: .06em; color: #111111; margin: 0;
  }
  .eg-row-count { font-size: .7rem; color: #777777; font-family: 'Inter', sans-serif; letter-spacing: .05em; }
  .eg-row-controls { display: flex; gap: .375rem; }
  .eg-scroll-btn {
    width: 32px; height: 32px; border: 1.5px solid #111111; border-radius: 2px;
    background: transparent; color: #111111;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .12s; padding: 0;
  }
  .eg-scroll-btn:hover { background: #111111; color: #F2F0E6; }
  .eg-scroll-btn:focus-visible { outline: 2px solid #C9D11A; outline-offset: 2px; }

  .eg-row {
    display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch; padding-bottom: .75rem; scrollbar-width: none;
  }
  .eg-row::-webkit-scrollbar { display: none; }

  .eg-card {
    flex-shrink: 0; width: 220px; border: none; background: transparent;
    padding: 0; text-align: left; scroll-snap-align: start;
    display: flex; flex-direction: column; transition: transform .2s;
    cursor: pointer; border-radius: 0;
  }
  .eg-card:hover { transform: translateY(-4px); }
  .eg-card:focus-visible { outline: 2px solid #C9D11A; outline-offset: 3px; border-radius: 2px; }

  .eg-img-wrap { position: relative; width: 100%; height: 290px; overflow: hidden; flex-shrink: 0; }
  .eg-img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; display: block; }
  .eg-card:hover .eg-img { transform: scale(1.04); }
  .eg-img-fallback {
    width: 100%; height: 100%; display: flex;
    align-items: center; justify-content: center; transition: filter .35s;
  }
  .eg-card:hover .eg-img-fallback { filter: brightness(1.1); }
  .eg-fallback-pattern {
    width: 100%; height: 100%;
    background-image: repeating-linear-gradient(
      45deg, transparent, transparent 18px,
      rgba(255,255,255,.04) 18px, rgba(255,255,255,.04) 19px
    );
  }

  .eg-info { padding: .75rem 0 .5rem; display: flex; flex-direction: column; gap: 0; }
  .eg-cat {
    font-family: 'Inter', sans-serif; font-size: .6rem; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase; color: #999999; margin-bottom: .3rem;
  }
  .eg-title {
    font-family: 'Bebas Neue', sans-serif; font-weight: 400; font-size: 1.2rem;
    letter-spacing: .03em; color: #111111; line-height: 1.15; margin: 0 0 .5rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .eg-meta-block { display: flex; flex-direction: column; gap: .18rem; margin-bottom: .5rem; }
  .eg-meta-row {
    display: flex; align-items: center; gap: 5px;
    font-size: .67rem; font-family: 'Inter', sans-serif; color: #888888;
  }
  .eg-meta-date { color: #555555; font-weight: 600; }
  .eg-meta-venue { color: #999999; }
  .eg-bottom-row {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: .4rem; border-top: 1px solid #EBEBEB;
  }
  .eg-price-free {
    font-family: 'Inter', sans-serif; font-size: .65rem; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; color: #111111;
  }
  .eg-price-paid { font-family: 'Inter', sans-serif; font-size: .65rem; font-weight: 700; color: #111111; }
  .eg-access-badges { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: .45rem; }
  .eg-access-chip {
    display: inline-flex; align-items: center; gap: 3px;
    font-family: 'Inter', sans-serif; font-size: .62rem; font-weight: 500;
    color: #888888; line-height: 1;
  }

  .eg-skel {
    background: linear-gradient(90deg, #EBEBEB 25%, #F5F5F5 50%, #EBEBEB 75%);
    background-size: 200%; animation: egskel 1.4s infinite; border-radius: 2px; margin-bottom: .5rem;
  }
  @keyframes egskel { 0%{background-position:200% 0}100%{background-position:-200% 0} }

  .eg-notice {
    margin-bottom: 1.5rem; padding: .5rem 1rem;
    background: rgba(0,0,0,.04); border-left: 3px solid #111111;
    font-size: .75rem; color: #555555; border-radius: 0 3px 3px 0;
    font-family: 'Inter', sans-serif;
  }

  @media (max-width: 900px) {
    .eg-section-head { flex-direction: column; align-items: flex-start; gap: .75rem; }
    .eg-card { width: 190px; }
    .eg-img-wrap { height: 250px; }
  }
  @media (max-width: 640px) {
    .eg-card { width: 165px; }
    .eg-img-wrap { height: 215px; }
    .eg-section-title { font-size: 1.75rem; }
    .eg-filters { gap: .25rem; }
    .eg-fbtn { font-size: .7rem; padding: .3rem .75rem; }
  }
`;

// ─── Componente principal ─────────────────────────────────────────────────────
// Recibe onOpenDetail(ev) desde el componente padre (home.jsx / App.jsx)
export default function EventsGrid({ onOpenDetail }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { byCategory, loading, fromApi, total } = useEvents();

  const catsWithEvents = loading
    ? CATEGORIES.slice(1)
    : CATEGORIES.slice(1).filter(c => byCategory(c).length > 0);

  const visibleCats = activeCategory === "Todos" ? catsWithEvents : [activeCategory];

  return (
    <>
      <style>{css}</style>
      <section className="eg-wrap">
        <div className="eg-inner">

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

          {!loading && !fromApi && (
            <div className="eg-notice">
              Mostrando eventos de muestra. En producción se cargan desde la API real del Ayuntamiento.
            </div>
          )}

          <div className="eg-filters" role="group" aria-label="Filtrar por categoría">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`eg-fbtn${activeCategory === c ? " active" : ""}`}
                onClick={() => setActiveCategory(c)}
                aria-pressed={activeCategory === c}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <><SkeletonRow/><SkeletonRow/><SkeletonRow/></>
          ) : (
            visibleCats.map(cat => (
              <EventRow
                key={cat}
                cat={cat}
                events={byCategory(cat)}
                onOpenDetail={onOpenDetail}
              />
            ))
          )}

        </div>
      </section>
    </>
  );
}