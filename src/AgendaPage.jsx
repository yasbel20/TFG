import { useState, useEffect } from "react";
import EventDetail from "./EventDetail";

// ─── Paleta INCLUGO ───────────────────────────────────────────────────────────
const P = {
  yellow: "#C9D11A",
  navy:   "#1A237E",
  blue:   "#3D47C8",
  cream:  "#F2F0E6",
};

const CAT_ACCENT = {
  "Música":     "#3D47C8",
  "Teatro":     "#7B1FA2",
  "Exposición": "#00695C",
  "Cine":       "#BF360C",
  "Danza":      "#AD1457",
  "Cultura":    "#1A237E",
  "Deporte":    "#2E7D32",
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
const WheelIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="2"/><path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z"/>
    <path d="M6 16a6 6 0 1 0 12 0" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const SignosIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 9v5h2v7h4v-7h2V9H3zm14 0v5h2v7h4v-7h2V9h-8z"/>
  </svg>
);
const BucleIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm-1-9v5l4-2.5L11 10z"/>
  </svg>
);
const PodoIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
  </svg>
);
const CalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
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

// ─── Fila de evento en la agenda ──────────────────────────────────────────────
function AgendaRow({ ev, onOpen }) {
  const accent = CAT_ACCENT[ev.cat] || P.navy;
  return (
    <button
      className="ag-row"
      onClick={() => onOpen(ev)}
      aria-label={`Ver detalle de ${ev.title}`}
    >
      {/* Hora */}
      <div className="ag-row-time" aria-label={ev.timeStr || "Hora por confirmar"}>
        {ev.timeStr
          ? <><span className="ag-time-val">{ev.timeStr.replace(" h","")}</span><span className="ag-time-h">h</span></>
          : <span className="ag-time-tbd">–</span>
        }
      </div>

      {/* Separador de color por categoría */}
      <div className="ag-row-accent" style={{ background: accent }} aria-hidden="true"/>

      {/* Contenido */}
      <div className="ag-row-body">
        <div className="ag-row-top">
          <span className="ag-row-cat" style={{ color: accent }}>{ev.cat.toUpperCase()}</span>
          <span className="ag-row-price">{ev.price}</span>
        </div>
        <h3 className="ag-row-title">{ev.title}</h3>
        <div className="ag-row-meta">
          <span className="ag-row-venue"><PinIcon/> {ev.venue}</span>
          {ev.district && <span className="ag-row-district">{ev.district}</span>}
        </div>
        {/* Badges accesibilidad */}
        {ev.access.length > 0 && (
          <div className="ag-row-badges" aria-label="Accesibilidad">
            {ev.access.includes("silla")   && <span className="ag-badge" title="Accesible PMR"><WheelIcon/></span>}
            {ev.access.includes("signos")  && <span className="ag-badge" title="Lengua de signos"><SignosIcon/></span>}
            {ev.access.includes("bucle")   && <span className="ag-badge" title="Bucle magnético"><BucleIcon/></span>}
            {ev.access.includes("braille") && <span className="ag-badge" title="Podotáctil"><PodoIcon/></span>}
          </div>
        )}
      </div>

      <div className="ag-row-arrow" aria-hidden="true">›</div>
    </button>
  );
}

// ─── Bloque de un día ─────────────────────────────────────────────────────────
function DayBlock({ dateKey, events, onOpen }) {
  const { dia, numero, mes, isToday } = parseDateKey(dateKey);
  return (
    <article className={`ag-day${isToday ? " ag-day--today" : ""}`} aria-label={`${dia} ${numero} de ${mes}`}>
      {/* Cabecera del día */}
      <div className="ag-day-head">
        <div className="ag-day-date">
          <span className="ag-day-name">{dia}</span>
          <span className="ag-day-num">{numero}</span>
          <span className="ag-day-month">{mes}</span>
        </div>
        {isToday && <span className="ag-today-badge">HOY</span>}
        <span className="ag-day-count">{events.length} evento{events.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Filas de eventos */}
      <div className="ag-day-events" role="list">
        {events.map(ev => (
          <div key={ev.id} role="listitem">
            <AgendaRow ev={ev} onOpen={onOpen}/>
          </div>
        ))}
      </div>
    </article>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonDay() {
  return (
    <div className="ag-day" aria-hidden="true">
      <div className="ag-day-head">
        <div className="ag-skel" style={{ width:120, height:24, borderRadius:4 }}/>
      </div>
      <div className="ag-day-events">
        {[1,2,3].map(i => (
          <div key={i} className="ag-row" style={{ pointerEvents:"none" }}>
            <div className="ag-skel" style={{ width:48, height:40, borderRadius:4 }}/>
            <div className="ag-row-accent" style={{ background:"#eee" }}/>
            <div className="ag-row-body" style={{ gap:8 }}>
              <div className="ag-skel" style={{ width:"30%", height:10, borderRadius:3 }}/>
              <div className="ag-skel" style={{ width:"70%", height:16, borderRadius:3 }}/>
              <div className="ag-skel" style={{ width:"50%", height:10, borderRadius:3 }}/>
            </div>
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
export default function AgendaPage({ onBack }) {
  const { events, loading, fromApi } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [weekOffset, setWeekOffset]       = useState(0);
  const [filterCat, setFilterCat]         = useState("Todos");

  // Detalle
  if (selectedEvent) {
    return <EventDetail ev={selectedEvent} onBack={() => setSelectedEvent(null)} />;
  }

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

        {/* ── Skip link ── */}
        <a href="#ag-main" className="ag-skip">Saltar al contenido</a>

        {/* ── Topbar ── */}
        <header>
          <nav className="ag-topbar" aria-label="Navegación de agenda">
            <button className="ag-back-btn" onClick={onBack} aria-label="Volver al inicio">
              <ArrowLeft/> Volver
            </button>

            <div className="ag-topbar-center">
              <span className="ag-page-label">
                <CalIcon/> Agenda
              </span>
            </div>

            {fromApi && (
              <div className="ag-api-badge">
                <span className="ag-api-dot"/>
                API Madrid
              </div>
            )}
          </nav>
        </header>

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
                  onOpen={setSelectedEvent}
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
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');

  .ag-page {
    min-height: 100vh;
    background: #F7F7F5;
    font-family: 'Inter', sans-serif;
    animation: ag-in .2s ease;
  }
  @keyframes ag-in { from{opacity:0} to{opacity:1} }

  /* Skip link */
  .ag-skip {
    position: absolute; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden;
    background: ${P.yellow}; color: #111; font-weight: 700; padding: .5rem 1rem;
    border-radius: 0 0 4px 4px; z-index: 9999; text-decoration: none;
  }
  .ag-skip:focus { position: fixed; left: 50%; transform: translateX(-50%); top: 0; width: auto; height: auto; }

  /* ── Topbar ── */
  .ag-topbar {
    background: #111111;
    border-bottom: 1px solid #222;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(1rem, 5vw, 4rem);
    height: 56px; position: sticky; top: 0; z-index: 50;
  }
  .ag-back-btn {
    display: inline-flex; align-items: center; gap: .45rem;
    background: transparent; border: 1.5px solid #444; color: #ccc;
    font-family: 'Inter', sans-serif; font-size: .8rem; font-weight: 500;
    padding: .4rem .9rem; border-radius: 4px; cursor: pointer; transition: all .15s;
  }
  .ag-back-btn:hover { background: #222; color: #fff; border-color: #666; }
  .ag-back-btn:focus-visible { outline: 2px solid ${P.yellow}; outline-offset: 2px; }

  .ag-topbar-center {
    display: flex; align-items: center;
  }
  .ag-page-label {
    display: inline-flex; align-items: center; gap: .5rem;
    font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem;
    letter-spacing: .1em; color: #ffffff;
  }

  .ag-api-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: .65rem; color: #666; letter-spacing: .08em; text-transform: uppercase;
  }
  .ag-api-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #4ade80;
    animation: ag-pulse 2s infinite;
  }
  @keyframes ag-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  /* ── Controles ── */
  .ag-controls {
    background: #ffffff;
    border-bottom: 1.5px solid #111;
    position: sticky; top: 56px; z-index: 40;
  }
  .ag-controls-inner {
    max-width: 900px; margin: 0 auto;
    padding: .75rem clamp(1rem, 5vw, 4rem);
    display: flex; flex-direction: column; gap: .75rem;
  }

  /* Navegación semana */
  .ag-week-nav {
    display: flex; align-items: center; gap: .5rem;
  }
  .ag-week-btn {
    width: 34px; height: 34px; border: 1.5px solid #CCCAC0; border-radius: 4px;
    background: transparent; color: #111; display: flex; align-items: center;
    justify-content: center; cursor: pointer; transition: all .12s; padding: 0;
  }
  .ag-week-btn:hover { background: #111; color: #fff; border-color: #111; }
  .ag-week-btn:focus-visible { outline: 2px solid ${P.yellow}; outline-offset: 2px; }

  .ag-week-label {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem;
    letter-spacing: .08em; color: #111; min-width: 180px; text-align: center;
  }
  .ag-week-today {
    background: ${P.yellow}; color: #111; border: none;
    font-family: 'Inter', sans-serif; font-size: .72rem; font-weight: 700;
    padding: .3rem .75rem; border-radius: 100px; cursor: pointer;
    letter-spacing: .06em; text-transform: uppercase; transition: opacity .15s;
  }
  .ag-week-today:hover { opacity: .8; }
  .ag-week-today:focus-visible { outline: 2px solid #111; outline-offset: 2px; }

  /* Filtros categoría */
  .ag-cat-filters {
    display: flex; gap: .3rem; flex-wrap: wrap;
  }
  .ag-cat-btn {
    padding: .28rem .75rem; border: 1.5px solid #CCCAC0; border-radius: 2px;
    background: transparent; color: #666; font-family: 'Inter', sans-serif;
    font-size: .7rem; font-weight: 500; cursor: pointer; transition: all .12s;
  }
  .ag-cat-btn:hover { background: #111; color: #fff; border-color: #111; }
  .ag-cat-btn.active { background: #111; color: ${P.yellow}; border-color: #111; font-weight: 700; }
  .ag-cat-btn:focus-visible { outline: 2px solid ${P.yellow}; outline-offset: 2px; }

  /* ── Main ── */
  .ag-main { padding: 2rem clamp(1rem, 5vw, 4rem) 5rem; }
  .ag-main-inner { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 0; }

  /* ── Bloque día ── */
  .ag-day {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 0;
    border-bottom: 1.5px solid #E0DED4;
    padding: 1.75rem 0;
  }
  .ag-day--today .ag-day-head { position: relative; }
  .ag-day:last-child { border-bottom: none; }

  @media (max-width: 600px) {
    .ag-day { grid-template-columns: 1fr; }
    .ag-day-head { display: flex; align-items: center; gap: .75rem; margin-bottom: .75rem; padding-right: 0; border-right: none; border-bottom: 1px solid #E0DED4; padding-bottom: .75rem; }
  }

  /* Cabecera día */
  .ag-day-head {
    display: flex; flex-direction: column; gap: .1rem;
    padding-right: 1.5rem; border-right: 1.5px solid #111;
    position: sticky; top: 150px; align-self: start;
  }
  .ag-day-name {
    font-family: 'Inter', sans-serif; font-size: .65rem; font-weight: 800;
    letter-spacing: .16em; color: #999; text-transform: uppercase;
  }
  .ag-day-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 3.5rem;
    letter-spacing: .02em; color: #111; line-height: 1;
  }
  .ag-day--today .ag-day-num { color: ${P.blue}; }
  .ag-day-month {
    font-family: 'Inter', sans-serif; font-size: .68rem; font-weight: 700;
    letter-spacing: .12em; color: #555; text-transform: uppercase;
  }
  .ag-today-badge {
    display: inline-block; margin-top: .4rem;
    background: ${P.yellow}; color: #111; font-size: .58rem; font-weight: 800;
    letter-spacing: .1em; padding: .2rem .5rem; border-radius: 2px;
    text-transform: uppercase;
  }
  .ag-day-count {
    font-size: .62rem; color: #aaa; margin-top: .5rem;
    font-family: 'Inter', sans-serif;
  }

  /* Lista de eventos del día */
  .ag-day-events {
    padding-left: 1.5rem;
    display: flex; flex-direction: column; gap: 0;
  }
  @media (max-width: 600px) {
    .ag-day-events { padding-left: 0; }
  }

  /* ── Fila de evento ── */
  .ag-row {
    display: flex; align-items: stretch;
    gap: 0; width: 100%; background: transparent; border: none; padding: 0;
    cursor: pointer; text-align: left;
    border-bottom: 1px solid #F0EEE8;
    transition: background .12s;
  }
  .ag-row:last-child { border-bottom: none; }
  .ag-row:hover { background: #ffffff; border-radius: 4px; }
  .ag-row:focus-visible { outline: 2px solid ${P.yellow}; outline-offset: 2px; border-radius: 4px; }

  /* Hora */
  .ag-row-time {
    width: 58px; flex-shrink: 0;
    display: flex; flex-direction: column; align-items: flex-end;
    justify-content: flex-start; padding: .875rem .75rem .875rem 0;
    font-family: 'Inter', sans-serif;
  }
  .ag-time-val { font-size: .82rem; font-weight: 700; color: #111; line-height: 1; }
  .ag-time-h   { font-size: .6rem; color: #999; margin-top: .1rem; }
  .ag-time-tbd { font-size: 1.2rem; color: #ddd; line-height: 1; margin-top: .5rem; }

  /* Acento de color */
  .ag-row-accent {
    width: 3px; flex-shrink: 0; border-radius: 2px; margin: .875rem 0;
  }

  /* Cuerpo */
  .ag-row-body {
    flex: 1; padding: .875rem .875rem .875rem .75rem;
    display: flex; flex-direction: column; gap: .3rem; min-width: 0;
  }
  .ag-row-top {
    display: flex; align-items: center; justify-content: space-between; gap: .5rem;
  }
  .ag-row-cat {
    font-family: 'Inter', sans-serif; font-size: .6rem; font-weight: 800;
    letter-spacing: .14em; text-transform: uppercase;
  }
  .ag-row-price {
    font-family: 'Inter', sans-serif; font-size: .68rem; font-weight: 700;
    color: #111; white-space: nowrap; flex-shrink: 0;
  }
  .ag-row-title {
    font-family: 'Bebas Neue', sans-serif; font-weight: 400; font-size: 1.25rem;
    letter-spacing: .03em; color: #111; line-height: 1.1; margin: 0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ag-row:hover .ag-row-title { color: ${P.blue}; }

  .ag-row-meta {
    display: flex; align-items: center; gap: .5rem; flex-wrap: wrap;
  }
  .ag-row-venue {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: .68rem; color: #888; font-family: 'Inter', sans-serif;
  }
  .ag-row-district {
    font-size: .62rem; color: #bbb; font-family: 'Inter', sans-serif;
  }

  /* Badges accesibilidad */
  .ag-row-badges {
    display: flex; gap: 4px; margin-top: .1rem;
  }
  .ag-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 20px; height: 20px; border-radius: 4px;
    background: ${P.cream}; color: ${P.navy}; border: 1px solid #E0DED4;
  }

  /* Flecha */
  .ag-row-arrow {
    display: flex; align-items: center;
    padding: 0 .75rem 0 .25rem;
    font-size: 1.2rem; color: #ccc;
    transition: color .12s; flex-shrink: 0;
  }
  .ag-row:hover .ag-row-arrow { color: ${P.blue}; }

  /* ── Empty state ── */
  .ag-empty {
    text-align: center; padding: 5rem 2rem;
    display: flex; flex-direction: column; align-items: center; gap: .75rem;
  }
  .ag-empty-icon { font-size: 3rem; }
  .ag-empty-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem;
    letter-spacing: .06em; color: #111;
  }
  .ag-empty-sub { font-size: .88rem; color: #999; max-width: 380px; line-height: 1.6; }

  /* ── Skeleton ── */
  .ag-skel {
    background: linear-gradient(90deg, #E8E8E6 25%, #F5F5F3 50%, #E8E8E6 75%);
    background-size: 200%; animation: ag-skel 1.4s infinite;
  }
  @keyframes ag-skel { 0%{background-position:200% 0}100%{background-position:-200% 0} }

  @media (max-width: 480px) {
    .ag-week-label { min-width: 120px; font-size: .95rem; }
    .ag-day-num { font-size: 2.8rem; }
    .ag-row-title { font-size: 1.1rem; }
  }
`;