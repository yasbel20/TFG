import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { WheelIcon, HandsIcon as SignosIcon, BucleIcon, PodoIcon } from "./AccessibilityIcons";


const CAT_ACCENT = {
  "Música":     "#3D47C8",
  "Teatro":     "#7C3AED",
  "Exposición": "#0369A1",
  "Cine":       "#92400E",
  "Danza":      "#DB2777",
  "Cultura":    "#1A237E",
};

// ─── Iconos ───────────────────────────────────────────────────────────────────
const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);
const CalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const ArrowSm = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── Parser ───────────────────────────────────────────────────────────────────
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
    price = /^\d+([.,]\d+)?$/.test(raw) ? `${raw.replace(",", ".")} €` : "Ver precio";
  }

  let dateKey = "sin-fecha"; // YYYY-MM-DD para agrupar
  let dateShort = "Consultar";
  let date = "Consultar fecha";
  let timeStr = "";
  let sortTs = Infinity;

  if (item.dtstart) {
    const s = new Date(item.dtstart);
    sortTs = s.getTime();
    const yyyy = s.getFullYear();
    const mm   = String(s.getMonth() + 1).padStart(2, "0");
    const dd   = String(s.getDate()).padStart(2, "0");
    dateKey = `${yyyy}-${mm}-${dd}`;
    dateShort = s.toLocaleDateString("es-ES", { day: "numeric", month: "short" }).toUpperCase();
    date = s.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

    const e = item.dtend ? new Date(item.dtend) : null;
    if (e && e.toDateString() !== s.toDateString()) {
      dateShort = `${dateShort} – ${e.toLocaleDateString("es-ES", { day: "numeric", month: "short" }).toUpperCase()}`;
      date = `${date} – ${e.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}`;
    }
    const h = s.getHours(), m = s.getMinutes();
    if (h !== 0 || m !== 0)
      timeStr = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} h`;
  }

  const venue = item.location?.["street-address"]
    || item.organization?.["organization-name"]
    || "Madrid";

  return {
    id:       item.id || `ev-${i}`,
    title:    item.title || "Evento sin título",
    cat, date, dateShort, dateKey, timeStr, sortTs, price, access,
    venue:    venue.length > 38 ? venue.slice(0, 36) + "…" : venue,
    venueRaw: venue,
    district: item.address?.["locality"] || "Madrid",
    image:    item.media?.["@id"] || item.image || item.media?.url || null,
    url:      item.link || "#",
    descFull: (item.description || "").replace(/<[^>]+>/g, "").trim(),
    org:      item.organization?.["organization-name"] || "",
  };
}

// ─── Datos de muestra ─────────────────────────────────────────────────────────
function makeSample() {
  const base = new Date();
  base.setHours(0,0,0,0);
  const day = (offset, h, m) => {
    const d = new Date(base); d.setDate(d.getDate() + offset);
    d.setHours(h, m, 0, 0); return d;
  };
  const fmt = d => {
    const yyyy = d.getFullYear(), mm = String(d.getMonth()+1).padStart(2,"0"), dd = String(d.getDate()).padStart(2,"0");
    return { dateKey:`${yyyy}-${mm}-${dd}`, dateShort:d.toLocaleDateString("es-ES",{day:"numeric",month:"short"}).toUpperCase(), date:d.toLocaleDateString("es-ES",{day:"numeric",month:"long",year:"numeric"}), timeStr:`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")} h`, sortTs:d.getTime() };
  };
  return [
    { id:1,  title:"Jazz en el Conde Duque",         cat:"Música",     ...fmt(day(0,20,0)),  price:"Gratis",  access:["silla","signos"], venue:"C.C. Conde Duque",         venueRaw:"C.C. Conde Duque",         district:"Centro",   image:null, url:"#", org:"Área de Cultura Madrid",      descFull:"Una noche de jazz en vivo en el emblemático Centro Cultural Conde Duque. Artistas internacionales y nacionales se unen para ofrecer una experiencia musical única." },
    { id:2,  title:"Concierto Flamenco Accesible",    cat:"Música",     ...fmt(day(0,21,30)), price:"10 €",    access:["silla"],          venue:"Café de las Artes",        venueRaw:"Café de las Artes",        district:"Malasaña", image:null, url:"#", org:"",                            descFull:"Noche de flamenco auténtico con artistas del barrio en un espacio completamente accesible." },
    { id:3,  title:"La Casa de Bernarda Alba",        cat:"Teatro",     ...fmt(day(0,19,30)), price:"15 €",    access:["signos"],          venue:"Teatro Español",           venueRaw:"Teatro Español",           district:"Centro",   image:null, url:"#", org:"Teatro Español",              descFull:"La obra cumbre de Federico García Lorca en una producción contemporánea." },
    { id:4,  title:"Picasso: Miradas múltiples",      cat:"Exposición", ...fmt(day(1,10,0)),  price:"12 €",    access:["silla","bucle"],  venue:"Museo Reina Sofía",        venueRaw:"Museo Reina Sofía",        district:"Atocha",   image:null, url:"#", org:"Museo Nacional Reina Sofía",  descFull:"Exposición temporal que reúne más de 150 obras del maestro malagueño." },
    { id:5,  title:"Cine: Todo sobre mi madre",       cat:"Cine",       ...fmt(day(1,18,0)),  price:"3 €",     access:["bucle"],           venue:"Filmoteca Española",       venueRaw:"Filmoteca Española",       district:"Lavapiés", image:null, url:"#", org:"Filmoteca Española",          descFull:"Ciclo Almodóvar. Proyección de la ganadora del Oscar a Mejor Película Extranjera." },
    { id:6,  title:"Noche de Danza Contemporánea",   cat:"Danza",      ...fmt(day(1,20,30)), price:"18 €",    access:["silla","signos"], venue:"Teatro del Canal",         venueRaw:"Teatro del Canal",         district:"Chamberí", image:null, url:"#", org:"Teatro del Canal",            descFull:"Una velada de danza contemporánea con compañías emergentes del panorama nacional e internacional." },
    { id:7,  title:"Feria del Libro de Madrid",       cat:"Cultura",    ...fmt(day(2,10,0)),  price:"Gratis",  access:["silla"],          venue:"Parque del Retiro",        venueRaw:"Parque del Retiro",        district:"Retiro",   image:null, url:"#", org:"Cámara del Libro",            descFull:"La cita anual más importante del sector editorial en España." },
    { id:8,  title:"Exposición: Carteles de Madrid",  cat:"Exposición", ...fmt(day(2,11,0)),  price:"Gratis",  access:["silla"],          venue:"Círculo de Bellas Artes",  venueRaw:"Círculo de Bellas Artes",  district:"Centro",   image:null, url:"#", org:"Círculo de Bellas Artes",     descFull:"Colección de los carteles más icónicos de la historia de Madrid." },
    { id:9,  title:"Recital de Poesía Accesible",     cat:"Cultura",    ...fmt(day(2,19,0)),  price:"Gratis",  access:["silla","signos"], venue:"Ateneo de Madrid",         venueRaw:"Ateneo de Madrid",         district:"Centro",   image:null, url:"#", org:"Ateneo de Madrid",            descFull:"Noche de poesía con intérprete de lengua de signos y textos en lectura fácil." },
    { id:10, title:"Concierto Sinfónico Inclusivo",   cat:"Música",     ...fmt(day(3,19,30)), price:"Desde 8 €",access:["silla","bucle"], venue:"Auditorio Nacional",       venueRaw:"Auditorio Nacional",       district:"Salamanca",image:null, url:"#", org:"Orquesta RTVE",               descFull:"Gran concierto sinfónico con bucle magnético en toda la sala y espacio PMR reservado en platea." },
    { id:11, title:"Teatro Infantil Accesible",       cat:"Teatro",     ...fmt(day(3,12,0)),  price:"6 €",     access:["silla","signos"], venue:"Teatro La Abadía",         venueRaw:"Teatro La Abadía",         district:"Argüelles",image:null, url:"#", org:"Teatro La Abadía",            descFull:"Espectáculo familiar con intérprete de LSE y materiales adaptados para niños con diversidad funcional." },
    { id:12, title:"Proyección Cine Mudo + Música",  cat:"Cine",       ...fmt(day(4,20,0)),  price:"5 €",     access:["silla"],          venue:"Filmoteca Española",       venueRaw:"Filmoteca Española",       district:"Lavapiés", image:null, url:"#", org:"Filmoteca Española",          descFull:"Ciclo de cine mudo con acompañamiento musical en directo." },
  ];
}

// ─── Hook de datos ────────────────────────────────────────────────────────────
function useEvents() {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    const API = "/api-madrid/egob/catalogo/206974-0-agenda-eventos-culturales-100.json";
    fetch(API)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const all    = (data["@graph"] || []).map(parseEvent);
        const parsed = all.filter(e => e.access.length > 0 && e.dateKey !== "sin-fecha");
        setEvents(parsed);
        setFromApi(true);
        setLoading(false);
      })
      .catch(() => {
        setEvents(makeSample());
        setFromApi(false);
        setLoading(false);
      });
  }, []);

  return { events, loading, fromApi };
}

// ─── Agrupar por fecha ────────────────────────────────────────────────────────
function groupByDate(events) {
  const map = {};
  events.forEach(ev => {
    if (!map[ev.dateKey]) map[ev.dateKey] = [];
    map[ev.dateKey].push(ev);
  });
  // Ordenar días y dentro de cada día por hora
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, evs]) => ({
      dateKey,
      events: evs.sort((a, b) => a.sortTs - b.sortTs),
    }));
}

// ─── Nombres de días ──────────────────────────────────────────────────────────
const DIAS = ["DOMINGO","LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO"];
const MESES = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return {
    dia:    DIAS[dt.getDay()],
    numero: d,
    mes:    MESES[m - 1],
    year:   y,
    isToday: new Date().toDateString() === dt.toDateString(),
  };
}

// ─── Tarjeta de evento ────────────────────────────────────────────────────────
function AgendaRow({ ev, onOpen }) {
  const accent = CAT_ACCENT[ev.cat] || CAT_ACCENT["Cultura"];
  return (
    <article
      className="ag-card"
      style={{ borderLeftColor: accent }}
      onClick={() => onOpen(ev)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onOpen(ev)}
      aria-label={`Ver detalle de ${ev.title}`}
    >
      {/* Fila superior: categoría · precio */}
      <div className="ag-card-top">
        <span className="ag-card-cat" style={{ color: accent }}>
          <span className="ag-cat-dot" style={{ background: accent }}/>
          {ev.cat}
        </span>
        {ev.price === "Gratis"
          ? <span className="ag-card-price-free">Gratis</span>
          : <span className="ag-card-price-paid">{ev.price}</span>}
      </div>

      {/* Título */}
      <h3 className="ag-card-title">{ev.title}</h3>

      {/* Fila inferior: meta · badges · botón */}
      <div className="ag-card-bottom">
        <div className="ag-card-meta">
          <span className="ag-meta-venue"><PinIcon/>{ev.venue}</span>
          {ev.timeStr  && <><span className="ag-dot">·</span><span className="ag-meta-time"><CalIcon/>{ev.timeStr}</span></>}
          {ev.district && <><span className="ag-dot">·</span><span className="ag-meta-dist">{ev.district}</span></>}
        </div>

        <div className="ag-card-right">
          {ev.access.length > 0 && (
            <div className="ag-badges" aria-label="Accesibilidad">
              {ev.access.includes("silla")   && <span className="ag-badge" title="Accesible PMR"><WheelIcon/></span>}
              {ev.access.includes("signos")  && <span className="ag-badge" title="Lengua de signos"><SignosIcon/></span>}
              {ev.access.includes("bucle")   && <span className="ag-badge" title="Bucle magnético"><BucleIcon/></span>}
              {ev.access.includes("braille") && <span className="ag-badge" title="Podotáctil"><PodoIcon/></span>}
            </div>
          )}
          <span className="ag-card-btn">Ver detalles <ArrowSm/></span>
        </div>
      </div>
    </article>
  );
}

// ─── Bloque de un día ─────────────────────────────────────────────────────────
function DayBlock({ dateKey, events, onOpen }) {
  const { dia, numero, mes, isToday } = parseDateKey(dateKey);
  return (
    <section className={`ag-day${isToday ? " ag-day--today" : ""}`} aria-label={`${dia} ${numero} de ${mes}`}>
      {/* Cabecera horizontal del día */}
      <div className="ag-day-head">
        <div className="ag-day-label">
          <span className="ag-day-weekday">{dia}</span>
          <span className="ag-day-num">{numero}</span>
          <span className="ag-day-month">{mes}</span>
          {isToday && <span className="ag-today-pill">HOY</span>}
        </div>
        <div className="ag-day-rule" aria-hidden="true"/>
        <span className="ag-day-count">{events.length} evento{events.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Tarjetas de eventos */}
      <div className="ag-day-cards" role="list">
        {events.map(ev => (
          <div key={ev.id} role="listitem">
            <AgendaRow ev={ev} onOpen={onOpen}/>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonDay() {
  return (
    <div className="ag-day" aria-hidden="true">
      <div className="ag-day-head">
        <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
          <div className="ag-skel" style={{ width:64, height:13, borderRadius:3 }}/>
          <div className="ag-skel" style={{ width:36, height:34, borderRadius:4 }}/>
          <div className="ag-skel" style={{ width:36, height:13, borderRadius:3 }}/>
        </div>
        <div className="ag-day-rule" style={{ background:"#ede8fb" }}/>
      </div>
      <div className="ag-day-cards">
        {[1,2].map(i => (
          <div key={i} className="ag-card" style={{ borderLeftColor:"#ddd8f5", pointerEvents:"none", gap:10 }}>
            <div className="ag-skel" style={{ width:"22%", height:10, borderRadius:3 }}/>
            <div className="ag-skel" style={{ width:"70%", height:20, borderRadius:4 }}/>
            <div className="ag-skel" style={{ width:"50%", height:10, borderRadius:3 }}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Navegación por semana ────────────────────────────────────────────────────
function weekRange(offset) {
  const now = new Date();
  now.setHours(0,0,0,0);
  now.setDate(now.getDate() + offset * 7);
  // Lunes de esa semana
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
}

function inWeek(dateKey, monday, sunday) {
  const [y,m,d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m-1, d);
  return dt >= monday && dt <= sunday;
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function AgendaPage() {
  const navigate = useNavigate();
  const { events, loading, fromApi } = useEvents();
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterCat, setFilterCat]   = useState("Todos");

  const openDetail = (ev) => navigate(`/evento/${ev.id}`, { state: { ev } });

  const CATS = ["Todos","Música","Teatro","Exposición","Cine","Danza","Cultura"];

  // Filtrar por categoría y semana
  const filtered = events.filter(ev => {
    const catOk = filterCat === "Todos" || ev.cat === filterCat;
    const { monday, sunday } = weekRange(weekOffset);
    const weekOk = inWeek(ev.dateKey, monday, sunday);
    return catOk && weekOk;
  });

  const grouped = groupByDate(filtered);
  const { monday, sunday } = weekRange(weekOffset);

  const fmtWeek = (d) => d.toLocaleDateString("es-ES", { day:"numeric", month:"short" }).toUpperCase();
  const weekLabel = `${fmtWeek(monday)} – ${fmtWeek(sunday)}`;

  const isPastWeek = weekOffset < 0;

  return (
    <>
      <style>{css}</style>
      <div className="ag-page">

        {/* ── NAV compartido ── */}
        <Navbar />

        {/* ── Controles de semana + filtro ── */}
        <div className="ag-controls">
          <div className="ag-controls-inner">

            {/* Navegación semana */}
            <div className="ag-week-nav" role="group" aria-label="Semana">
              <button
                className="ag-week-btn"
                onClick={() => setWeekOffset(w => w - 1)}
                aria-label="Semana anterior"
              >
                <ChevronLeft/>
              </button>
              <span className="ag-week-label" aria-live="polite" aria-atomic="true">
                {weekOffset === 0 ? "Esta semana" : weekOffset === 1 ? "Próxima semana" : weekLabel}
              </span>
              <button
                className="ag-week-btn"
                onClick={() => setWeekOffset(w => w + 1)}
                aria-label="Semana siguiente"
              >
                <ChevronRight/>
              </button>
              {weekOffset !== 0 && (
                <button
                  className="ag-week-today"
                  onClick={() => setWeekOffset(0)}
                  aria-label="Volver a esta semana"
                >
                  Hoy
                </button>
              )}
            </div>

            {/* Filtro categoría */}
            <div className="ag-cat-filters" role="group" aria-label="Filtrar por categoría">
              {CATS.map(c => (
                <button
                  key={c}
                  className={`ag-cat-btn${filterCat === c ? " active" : ""}`}
                  onClick={() => setFilterCat(c)}
                  aria-pressed={filterCat === c}
                >
                  {c}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ── Contenido principal ── */}
        <main id="ag-main" className="ag-main">
          <div className="ag-main-inner">

            {loading ? (
              <><SkeletonDay/><SkeletonDay/><SkeletonDay/></>
            ) : grouped.length === 0 ? (
              <div className="ag-empty" role="status">
                <span className="ag-empty-icon">📅</span>
                <p className="ag-empty-title">Sin eventos esta semana</p>
                <p className="ag-empty-sub">
                  {filterCat !== "Todos"
                    ? `No hay eventos de ${filterCat} esta semana.`
                    : "No hay eventos accesibles registrados para esta semana."}
                </p>
                {weekOffset !== 0 && (
                  <button className="ag-week-today" onClick={() => setWeekOffset(0)} style={{ marginTop:"1rem" }}>
                    Ver esta semana
                  </button>
                )}
              </div>
            ) : (
              grouped.map(({ dateKey, events: dayEvs }) => (
                <DayBlock
                  key={dateKey}
                  dateKey={dateKey}
                  events={dayEvs}
                  onOpen={openDetail}
                />
              ))
            )}

          </div>
        </main>

      </div>
    </>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const css = `
  /* ── Base ── */
  .ag-page {
    min-height: 100vh;
    background: #ffffff;
    font-family: 'Inter', var(--ff-b), system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
  }

  /* ── Barra de controles ── */
  .ag-controls {
    background: #fff;
    border-bottom: 1px solid #eae6f6;
    position: sticky; top: 60px; z-index: 40;
    box-shadow: 0 2px 12px rgba(79,62,200,.06);
  }
  .ag-controls-inner {
    max-width: 960px; margin: 0 auto;
    padding: 1rem clamp(1rem, 5vw, 3rem);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: .85rem;
  }

  /* Navegación semana */
  .ag-week-nav { display: flex; align-items: center; gap: .5rem; }
  .ag-week-btn {
    width: 36px; height: 36px;
    border: 1.5px solid var(--border); border-radius: 0;
    background: transparent; color: var(--text-primary);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .12s; padding: 0; flex-shrink: 0;
  }
  .ag-week-btn:hover { background: var(--brand); color: #fff; border-color: var(--brand); }
  .ag-week-btn:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

  .ag-week-label {
    font-family: var(--ff-b);
    font-size: .78rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
    color: var(--text-primary); min-width: 210px; text-align: center;
  }
  .ag-week-today {
    background: var(--brand); color: #fff; border: none;
    font-family: var(--ff-b);
    font-size: .78rem; font-weight: 600;
    padding: .3rem .75rem; border-radius: 0; cursor: pointer;
    letter-spacing: .1em; text-transform: uppercase;
    transition: opacity .15s; margin-left: .25rem;
  }
  .ag-week-today:hover { opacity: .82; }

  /* Filtros */
  .ag-cat-filters {
    display: flex; gap: .4rem;
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .ag-cat-filters::-webkit-scrollbar { display: none; }
  .ag-cat-btn {
    padding: .38rem 1rem; flex-shrink: 0;
    border: 1.5px solid var(--border); border-radius: 0;
    background: transparent; color: var(--text-muted);
    font-family: var(--ff-b);
    font-size: .78rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: all .12s; white-space: nowrap;
  }
  .ag-cat-btn:hover { border-color: var(--brand); color: var(--brand); background: #f5f3ff; }
  .ag-cat-btn.active { background: var(--brand); color: #fff; border-color: var(--brand); font-weight: 700; }
  .ag-cat-btn:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

  /* ── Área principal ── */
  .ag-main { padding: 2.5rem clamp(1rem, 5vw, 3rem) 7rem; }
  .ag-main-inner {
    max-width: 960px; margin: 0 auto;
    display: flex; flex-direction: column; gap: 3rem;
  }

  /* ── Bloque de día ── */
  .ag-day { display: flex; flex-direction: column; gap: 1.1rem; }

  /* Cabecera del día */
  .ag-day-head { display: flex; align-items: center; gap: 1.1rem; }
  .ag-day-label { display: flex; align-items: baseline; gap: .6rem; flex-shrink: 0; }
  .ag-day-weekday {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .78rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted);
  }
  .ag-day-num {
    font-family: 'Bebas Neue', var(--ff-h), sans-serif;
    font-size: 3rem; line-height: 1;
    color: var(--text-muted); letter-spacing: .02em;
  }
  .ag-day--today .ag-day-num { color: var(--text-primary); }
  .ag-day-month {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .78rem; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted);
  }
  .ag-today-pill {
    background: var(--brand); color: #fff;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .65rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
    padding: .22rem .55rem; border-radius: 4px; margin-left: .3rem;
    vertical-align: middle; position: relative; top: -2px;
  }
  .ag-day-rule { flex: 1; height: 1px; background: #e4dff5; }
  .ag-day-count {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .75rem; font-weight: 500;
    color: var(--text-tertiary); white-space: nowrap; flex-shrink: 0;
  }

  /* ── Lista de tarjetas ── */
  .ag-day-cards { display: flex; flex-direction: column; gap: .75rem; }

  /* ── Tarjeta de evento ── */
  .ag-card {
    background: #ffffff;
    border: none;
    border-left: 5px solid;
    box-shadow: inset 0 0 0 1px #eae6f5;
    border-radius: 0;
    padding: 1.2rem 1.4rem 1.1rem 1.2rem;
    cursor: pointer;
    display: flex; flex-direction: column; gap: .65rem;
    transition: background .15s, box-shadow .18s, transform .18s;
    text-align: left;
  }
  .ag-card:hover {
    background: var(--brand-subtle);
    box-shadow: 0 6px 28px rgba(79,62,200,.11);
    transform: translateX(4px);
  }
  .ag-card:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

  /* Fila superior */
  .ag-card-top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
  .ag-card-cat {
    display: flex; align-items: center; gap: .45rem;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .72rem; font-weight: 800;
    letter-spacing: .1em; text-transform: uppercase;
  }
  .ag-cat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .ag-card-price-free {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .82rem; font-weight: 700;
    color: var(--success); white-space: nowrap;
  }
  .ag-card-price-paid {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .82rem; font-weight: 700;
    color: var(--text-primary); white-space: nowrap;
  }

  /* Título */
  .ag-card-title {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: 1.15rem; font-weight: 700; line-height: 1.3;
    color: var(--text-primary); margin: 0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    transition: color .15s;
  }
  .ag-card:hover .ag-card-title { color: var(--brand); }

  /* Fila inferior */
  .ag-card-bottom {
    display: flex; align-items: center; justify-content: space-between;
    gap: .75rem; flex-wrap: wrap;
  }
  .ag-card-meta {
    display: flex; align-items: center; flex-wrap: wrap;
    gap: .25rem .4rem;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .82rem; color: var(--text-muted); line-height: 1.4;
  }
  .ag-meta-venue { display: inline-flex; align-items: center; gap: 4px; }
  .ag-meta-time  { display: inline-flex; align-items: center; gap: 4px; }
  .ag-meta-dist  { color: var(--text-tertiary); }
  .ag-dot { color: #ccc; }

  /* Badges + botón */
  .ag-card-right { display: flex; align-items: center; gap: .65rem; flex-shrink: 0; }
  .ag-badges { display: flex; gap: 4px; }
  .ag-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 26px; height: 26px; border-radius: 0;
    background: #ede9ff; color: var(--brand); border: 1px solid #d4cefc;
    transition: background .12s;
  }
  .ag-card:hover .ag-badge { background: var(--brand); color: #fff; border-color: var(--brand); }
  .ag-card-btn {
    display: inline-flex; align-items: center; gap: .35rem;
    border: 1.5px solid #ddd8f2; color: var(--text-muted);
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .75rem; font-weight: 600;
    padding: .45rem 1rem; border-radius: 0;
    transition: all .15s; white-space: nowrap;
  }
  .ag-card:hover .ag-card-btn { border-color: var(--brand); color: var(--brand); background: #f5f3ff; }

  /* ── Empty state ── */
  .ag-empty {
    text-align: center; padding: 6rem 2rem;
    display: flex; flex-direction: column; align-items: center; gap: .9rem;
  }
  .ag-empty-icon { font-size: 3.5rem; line-height: 1; }
  .ag-empty-title {
    font-family: 'Bebas Neue', var(--ff-h), sans-serif;
    font-size: 2rem; letter-spacing: .06em;
    color: var(--text-primary); margin: .5rem 0 0;
  }
  .ag-empty-sub {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .9rem; color: var(--text-tertiary);
    max-width: 360px; line-height: 1.7;
  }

  /* ── Skeleton ── */
  .ag-skel {
    background: linear-gradient(90deg, #eae6f6 25%, #f5f3fc 50%, #eae6f6 75%);
    background-size: 200%; animation: ag-skel 1.5s infinite;
  }
  @keyframes ag-skel { from{background-position:200% 0} to{background-position:-200% 0} }

  /* ── Responsivo ── */
  @media (max-width: 640px) {
    .ag-controls-inner { flex-direction: column; align-items: flex-start; }
    .ag-week-label { min-width: 150px; font-size: 1.1rem; }
    .ag-day-num { font-size: 2.4rem; }
    .ag-card { padding: 1rem 1rem .95rem 1rem; }
    .ag-card-title { font-size: 1rem; white-space: normal; }
    .ag-card-btn { display: none; }
  }
`;