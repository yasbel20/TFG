import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { WheelIcon, HandsIcon as SignosIcon, BucleIcon, PodoIcon } from "./AccessibilityIcons";
import { CAT_ACCENT, CATEGORY_LIST } from "./constants/categories";
import { MADRID_EVENTS_URL } from "./constants/api";
import { parseEvent } from "./utils/parsing";
import "./AgendaPage.css";

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
    fetch(MADRID_EVENTS_URL)
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
          <button className="ag-card-btn" onClick={() => onOpen(ev)} aria-label={`Ver detalles de ${ev.title}`}>
            Ver detalles <ArrowSm/>
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Bloque de un día ─────────────────────────────────────────────────────────
function DayBlock({ dateKey, events, onOpen }) {
  const { dia, numero, mes, isToday } = parseDateKey(dateKey);
  return (
    <section className={`ag-day${isToday ? " ag-day--today" : ""} reveal`} aria-label={`${dia} ${numero} de ${mes}`}>
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

  const CATS = CATEGORY_LIST;

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