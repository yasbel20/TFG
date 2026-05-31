import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventsGrid  from "./eventsgrid";
import { preloadUnsplashCategories } from "./useUnsplash";
import Navbar from "./Navbar";
import { WheelIcon, HandsIcon, BucleIcon, PodoIcon } from "./AccessibilityIcons";
import { useAccessibility } from "./AccessibilityContext";
import { JUNE_EVENTS } from "./juneEvents";
import "./home.css";

preloadUnsplashCategories();

/* ══════════════════════════════════════════════════
   ICONOS
══════════════════════════════════════════════════ */
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
   AGENDA DESTACADA — helpers
══════════════════════════════════════════════════ */
const CAT_COLOR_AG = { "Música":"#3D47C8","Teatro":"#7C3AED","Exposición":"#0369A1","Cine":"#92400E","Danza":"#DB2777","Cultura":"#1A237E" };
const DIAS_AG = ["DOM","LUN","MAR","MIÉ","JUE","VIE","SÁB"];

function parseDateKeyAg(key) {
  const [y,m,d] = key.split("-").map(Number);
  return new Date(y, m-1, d);
}

function toKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function parseEvAg(item, i) {
  const desc = ((item.description||"")+" "+(item.organization?.["organization-name"]||"")).toLowerCase();
  const t = (item.title||"").toLowerCase();
  let cat = "Cultura";
  if (/concierto|música|jazz|flamenco|rock|pop/.test(t+desc))  cat="Música";
  else if (/teatro|obra|ballet|ópera/.test(t+desc))            cat="Teatro";
  else if (/exposici|muestra|exhibit/.test(t+desc))            cat="Exposición";
  else if (/cine|film|pelícu/.test(t+desc))                    cat="Cine";
  else if (/danza|baile/.test(t+desc))                         cat="Danza";
  const accRaw = item.organization?.["accesibility"]||"";
  const codes  = accRaw.toString().split(",").map(c=>c.trim()).filter(Boolean);
  const access = [];
  if (codes.includes("1")||codes.includes("2")) access.push("silla");
  if (codes.includes("4")) access.push("signos");
  if (codes.includes("5")) access.push("braille");
  if (codes.includes("6")) access.push("bucle");
  let dateKey="sin-fecha", timeStr="";
  if (item.dtstart) {
    const s = new Date(item.dtstart);
    dateKey = toKey(s);
    const h=s.getHours(), m2=s.getMinutes();
    if (h!==0||m2!==0) timeStr=`${String(h).padStart(2,"0")}:${String(m2).padStart(2,"0")}h`;
  }
  const venue = item.location?.["street-address"]||item.organization?.["organization-name"]||"Madrid";
  return {
    id: item.id||`ag-${i}`, title: item.title||"Evento", cat, dateKey, timeStr, access,
    venue: venue.length>36 ? venue.slice(0,34)+"…" : venue,
    image: item.media?.["@id"]||item.media?.url||item.image||item["@thumbnail"]||null,
    url: item.link||"#",
    descFull: (item.description||"").replace(/<[^>]+>/g,"").trim(),
    price: (item["event-free"]===false||item["event-free"]==="false") ? "Ver precio" : "Gratis",
  };
}

function makeSampleAg() {
  const base = new Date(); base.setHours(0,0,0,0);
  const mk = (offset,h,m2,title,cat,venue,timeStr) => {
    const d=new Date(base); d.setDate(d.getDate()+offset); d.setHours(h,m2,0,0);
    return { id:`s${offset}${h}`,title,cat,dateKey:toKey(d),timeStr,access:["silla"],venue,image:null,url:"#",descFull:"",price:"Gratis" };
  };
  return [
    mk(0,20,0,"Jazz en el Conde Duque","Música","C.C. Conde Duque","20:00h"),
    mk(0,19,30,"La Casa de Bernarda Alba","Teatro","Teatro Español","19:30h"),
    mk(0,21,0,"Concierto Flamenco Accesible","Música","Café de las Artes","21:00h"),
    mk(1,10,0,"Picasso: Miradas múltiples","Exposición","Museo Reina Sofía","10:00h"),
    mk(1,18,0,"Cine: Todo sobre mi madre","Cine","Filmoteca Española","18:00h"),
    mk(1,20,30,"Noche de Danza Contemporánea","Danza","Teatro del Canal","20:30h"),
    mk(2,10,0,"Feria del Libro de Madrid","Cultura","Parque del Retiro","10:00h"),
  ];
}

function AgendaDestacada() {
  const navigate = useNavigate();
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selKey, setSelKey]     = useState(() => toKey(new Date()));

  useEffect(() => {
    fetch("/api-madrid/egob/catalogo/206974-0-agenda-eventos-culturales-100.json")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const parsed = (data["@graph"]||[]).map(parseEvAg).filter(e => e.dateKey!=="sin-fecha" && e.access.length>0);
        setEvents(parsed.length ? parsed : makeSampleAg());
      })
      .catch(() => setEvents(makeSampleAg()))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date(); today.setHours(0,0,0,0);
  const strip = Array.from({length:7},(_,i) => {
    const d = new Date(today); d.setDate(today.getDate() + weekOffset*7 - 3 + i);
    return { key:toKey(d), dia:DIAS_AG[d.getDay()], num:d.getDate(), isToday:d.toDateString()===today.toDateString() };
  });

  const goWeek = (dir) => {
    const newOffset = weekOffset + dir;
    setWeekOffset(newOffset);
    const d = new Date(today); d.setDate(today.getDate() + newOffset*7);
    setSelKey(toKey(d));
  };

  const dayEvs = events.filter(e => e.dateKey===selKey).slice(0,4);
  const selDate = parseDateKeyAg(selKey);
  const selLabel = selDate.toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

  return (
    <section className="ad-sec" aria-labelledby="ad-title">
      <style>{agendaCss}</style>
      <div className="ad-inner">
        <h2 id="ad-title" className="ad-heading">
          AGENDA<br/><span className="ad-hl">DESTACADA</span>
        </h2>

        {/* Franja de días */}
        <div className="ad-strip-wrap">
          <button className="ad-nav-btn" onClick={() => goWeek(-1)} aria-label="Semana anterior">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="ad-strip" role="tablist" aria-label="Seleccionar día">
            {strip.map(d => (
              <button
                key={d.key}
                role="tab"
                aria-selected={d.key===selKey}
                className={`ad-day${d.key===selKey?" ad-day--sel":""}${d.isToday?" ad-day--today":""}`}
                onClick={() => setSelKey(d.key)}
              >
                <span className="ad-day-name">{d.dia}</span>
                <span className="ad-day-num">{d.num}</span>
              </button>
            ))}
          </div>
          <button className="ad-nav-btn" onClick={() => goWeek(1)} aria-label="Semana siguiente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        <p className="ad-day-label">{selLabel.charAt(0).toUpperCase()+selLabel.slice(1)}</p>

        {/* Lista de eventos */}
        <div className="ad-list" role="list">
          {loading ? [1,2,3].map(i=>(
            <div key={i} className="ad-skel" aria-hidden="true"/>
          )) : dayEvs.length===0 ? (
            <p className="ad-empty">No hay eventos accesibles registrados para este día.</p>
          ) : dayEvs.map(ev=>(
            <article
              key={ev.id} className="ad-row" role="listitem"
              onClick={()=>navigate(`/evento/${ev.id}`,{state:{ev}})}
              tabIndex={0} onKeyDown={e=>e.key==="Enter"&&navigate(`/evento/${ev.id}`,{state:{ev}})}
              aria-label={ev.title}
            >
              <div className="ad-info">
                <strong className="ad-ev-title">{ev.title}</strong>
                <span className="ad-ev-venue">{ev.venue}</span>
              </div>
              <span className="ad-ev-cat" style={{color:CAT_COLOR_AG[ev.cat]||"#1A237E"}}>{ev.cat}</span>
              <span className="ad-ev-time">{ev.timeStr||"—"}</span>
            </article>
          ))}
        </div>

        <div className="ad-footer">
          <button className="ad-more-btn" onClick={()=>navigate("/agenda")}>
            Ver agenda completa <ArrowRightIcon size={13}/>
          </button>
        </div>
      </div>
    </section>
  );
}

const agendaCss = `
  .ad-sec {
    background: #fff;
    padding: clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,6rem);
    border-top: 1px solid #f0f0f0;
  }
  .ad-inner {
    max-width: 1280px;
    margin: 0 auto;
  }
  .ad-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 7vw, 7rem);
    letter-spacing: .02em;
    color: var(--ink);
    line-height: .9;
    text-align: left;
    margin: 0 0 2rem;
  }
  .ad-hl { color: var(--brand); }

  /* Franja de días */
  .ad-strip-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    margin-bottom: 1.25rem;
  }
  .ad-nav-btn {
    background: #f3f4f6;
    border: none;
    border-radius: 6px;
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #374151;
    flex-shrink: 0;
    transition: background .12s;
  }
  .ad-nav-btn:hover { background: #e5e7eb; color: #111; }
  .ad-strip {
    display: flex;
    justify-content: center;
    gap: .35rem;
  }
  .ad-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .2rem;
    background: #f5f5f5;
    border: none;
    border-radius: 8px;
    padding: .5rem .7rem;
    cursor: pointer;
    min-width: 52px;
    transition: background .12s;
  }
  .ad-day:hover { background: #ece9f8; }
  .ad-day--sel {
    background: #111;
    color: #fff;
  }
  .ad-day--today:not(.ad-day--sel) { border: 1.5px solid #3d47c8; }
  .ad-day-name {
    font-family: 'Inter', sans-serif;
    font-size: .62rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  .ad-day-num {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    line-height: 1;
  }

  /* Etiqueta del día seleccionado */
  .ad-day-label {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #111;
    text-align: center;
    margin: 0 0 1.25rem;
  }

  /* Lista */
  .ad-list { display: flex; flex-direction: column; }
  .ad-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: .9rem 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background .12s;
    border-radius: 4px;
  }
  .ad-row:hover { background: #fafafa; }
  .ad-row:last-child { border-bottom: none; }

  .ad-thumb {
    width: 56px; height: 56px;
    border-radius: 6px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .ad-thumb img { width:100%; height:100%; object-fit:cover; display:block; }

  .ad-info { flex: 1; min-width: 0; }
  .ad-ev-title {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: .88rem;
    font-weight: 700;
    color: #111;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: .2rem;
  }
  .ad-ev-venue {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: .74rem;
    color: #9ca3af;
  }
  .ad-ev-cat {
    font-family: 'Inter', sans-serif;
    font-size: .74rem;
    font-weight: 600;
    white-space: nowrap;
    min-width: 80px;
    text-align: right;
  }
  .ad-ev-time {
    font-family: 'Inter', sans-serif;
    font-size: .78rem;
    font-weight: 600;
    color: #374151;
    white-space: nowrap;
    min-width: 55px;
    text-align: right;
  }

  .ad-empty {
    font-family: 'Inter', sans-serif;
    font-size: .85rem; color: #9ca3af;
    text-align: center; padding: 2rem 0;
  }
  .ad-skel {
    height: 64px; background: #f3f4f6;
    border-radius: 6px; margin-bottom: .5rem;
    animation: ad-pulse 1.4s ease-in-out infinite;
  }
  @keyframes ad-pulse {
    0%,100% { opacity:1; } 50% { opacity:.5; }
  }

  .ad-footer { text-align: center; margin-top: 1.5rem; }
  .ad-more-btn {
    display: inline-flex; align-items: center; gap: .4rem;
    background: none; border: 1.5px solid #3d47c8;
    color: #3d47c8; padding: .55rem 1.4rem;
    font-family: 'Inter', sans-serif;
    font-size: .82rem; font-weight: 600;
    cursor: pointer; border-radius: 0;
    transition: background .15s, color .15s;
  }
  .ad-more-btn:hover { background: #3d47c8; color: #fff; }
`;

/* ══════════════════════════════════════════════════
   DATOS ESTÁTICOS
══════════════════════════════════════════════════ */
const ACCESS_INFO = {
  silla:      { label: "Silla de ruedas",   Icon: WheelIcon   },
  signos:     { label: "Lengua de signos",  Icon: HandsIcon   },
  audio:      { label: "Audiodescripción",  Icon: AudioIcon   },
  subtitulos: { label: "Subtítulos",        Icon: SubIcon     },
  bucle:      { label: "Bucle magnético",   Icon: BucleIcon   },
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

const toSlug = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\s+/g,"-");

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
   TOOLS SHOWCASE
══════════════════════════════════════════════════ */
const TOOLS_ITEMS = [
  {
    key: "tab",
    video: "/img/eventos/case/TAB1.mp4",
    label: "Modo teclado",
    desc: "Navega con Tab y escucha en voz alta cada elemento de la página.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>
      </svg>
    ),
  },
  {
    key: "clic",
    video: "/img/eventos/case/ESCUCHAR.mp4",
    label: "Clic y escuchar",
    desc: "Pulsa sobre cualquier texto para que INCLUGO lo lea en voz alta.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 9l2 12 1.8-5.2L18 14z"/>
        <path d="M9 9H3M9 9V3"/>
      </svg>
    ),
  },
  {
    key: "visibilidad",
    video: "/img/eventos/case/VISIBILIDAD1.mp4",
    label: "Texto visible",
    desc: "Aumenta el espaciado entre letras y líneas para mejorar la lectura.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    key: "mascara",
    video: "/img/eventos/case/MASCARA1.mp4",
    label: "Máscara de foco",
    desc: "Resalta la zona activa de la pantalla para reducir la distracción visual.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4M2 10h20" strokeDasharray="3 3"/>
      </svg>
    ),
  },
  {
    key: "escala",
    video: "/img/eventos/case/ESCALA1.mp4",
    label: "Escala de grises",
    desc: "Convierte todos los colores de la web a escala de grises.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a10 10 0 0 1 0 20M2 12h20"/>
      </svg>
    ),
  },
];

function ToolsShowcase() {
  const [active, setActive] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [active]);

  const item = TOOLS_ITEMS[active];

  return (
    <div className="ts-outer">
      {/* Título alineado a la izquierda */}
      <div className="ts-header">
        <h2 id="tools-heading" className="tools-heading">
          INCLUYE<br/>
          <span className="hl">HERRAMIENTAS</span><br/>
          PARA TODOS
        </h2>
      </div>

      {/* Columnas: lista | video */}
      <div className="ts-wrap">
        <ul className="ts-list" role="list">
          {TOOLS_ITEMS.map((t, i) => (
            <li key={t.key}>
              <button
                className={`ts-item${active === i ? " ts-item--active" : ""}`}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
              >
                <span className="ts-item-icon">{t.icon}</span>
                <span className="ts-item-text">
                  <span className="ts-item-label">{t.label}</span>
                  <span className="ts-item-desc">{t.desc}</span>
                </span>
                <span className="ts-item-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="ts-right" aria-hidden="true">
          <video
            ref={videoRef}
            key={item.video}
            className="ts-video"
            src={item.video}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   HERRAMIENTAS CSS
══════════════════════════════════════════════════ */
const toolsCss = `
  .tools-sec {
    background: #fff;
    padding: clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,6rem);
    border-top: none;
    position: relative;
  }
  .tools-sec::before {
    display: none;
  }
  .tools-sec::after {
    display: none;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(to top, #fff, transparent);
    pointer-events: none;
    z-index: 1;
  }
  /* ── Showcase layout ── */
  .ts-outer {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }
  .ts-header {
    text-align: left;
  }
  .ts-intro {
    font-family: 'Inter', sans-serif;
    font-size: .88rem;
    color: #6b7280;
    line-height: 1.65;
    margin: .6rem 0 0;
  }
  .ts-wrap {
    display: grid;
    grid-template-columns: 1fr 1.55fr;
    gap: clamp(2rem,4vw,4rem);
    align-items: start;
  }
  .ts-list {
    list-style: none;
    margin: 0; padding: 0;
    display: flex;
    flex-direction: column;
    gap: .35rem;
  }
  .ts-list { border-left: 2px solid #e5e7eb; }
  .ts-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: .85rem;
    padding: .9rem 1rem .9rem 1.25rem;
    background: none;
    border: none;
    border-left: 3px solid transparent;
    margin-left: -2px;
    border-radius: 0 10px 10px 0;
    cursor: pointer;
    text-align: left;
    transition: background .18s, border-color .18s;
    position: relative;
  }
  .ts-item:hover {
    background: #f4f4f8;
    border-left-color: #c7cdf8;
  }
  .ts-item:hover .ts-item-icon {
    background: #eef0fe;
    color: #3d47c8;
  }
  .ts-item:hover .ts-item-label { color: #3d47c8; }
  .ts-item--active {
    background: #eef0fe;
    border-left-color: #3d47c8;
  }
  .ts-item-icon {
    flex-shrink: 0;
    width: 40px; height: 40px;
    background: #f4f4f8;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #9ca3af;
    transition: background .18s, color .18s;
  }
  .ts-item--active .ts-item-icon {
    background: #3d47c8;
    color: #fff;
  }
  .ts-item-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .18rem;
  }
  .ts-item-label {
    font-family: 'Inter', sans-serif;
    font-size: .9rem;
    font-weight: 600;
    color: #374151;
    transition: color .18s;
  }
  .ts-item--active .ts-item-label { color: #3d47c8; }
  .ts-item-desc {
    font-family: 'Inter', sans-serif;
    font-size: .74rem;
    color: #9ca3af;
    line-height: 1.4;
  }
  /* Flecha: visible solo en hover y activo */
  .ts-item-arrow {
    flex-shrink: 0;
    color: #d1d5db;
    opacity: 0;
    transform: translateX(-4px);
    transition: color .18s, opacity .18s, transform .18s;
  }
  .ts-item:hover .ts-item-arrow,
  .ts-item--active .ts-item-arrow {
    opacity: 1;
    transform: translateX(0);
    color: #3d47c8;
  }
  /* Hint "Ver demo" en items no activos */
  .ts-item:not(.ts-item--active):hover::after {
    content: 'Ver demo';
    position: absolute;
    right: 2.5rem;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'Inter', sans-serif;
    font-size: .68rem;
    font-weight: 600;
    color: #3d47c8;
    background: #eef0fe;
    padding: .2rem .55rem;
    border-radius: 999px;
  }

  /* ── Video ── */
  .ts-right {
    border-radius: 0;
    overflow: hidden;
    box-shadow: 0 28px 70px rgba(0,0,0,.18), 0 6px 20px rgba(61,71,200,.12);
  }
  .ts-video {
    width: 100%;
    height: auto;
    display: block;
  }
  @media (max-width: 860px) {
    .ts-wrap { grid-template-columns: 1fr; }
    .ts-right { order: -1; }
    .ts-header { max-width: 100%; }
  }
  /* ── Mantener estilos legacy del tools-heading ── */
  .tools-inner {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 clamp(1rem,4vw,3rem);
  }
  @media (max-width: 768px) { .tools-inner { grid-template-columns: 1fr; } }

  .tools-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 7vw, 7rem);
    letter-spacing: .02em;
    color: var(--ink);
    line-height: .9;
    margin: .4rem 0 1rem;
  }
  .tools-heading .hl { color: var(--brand); }
  .tools-desc {
    font-family: 'Inter', sans-serif;
    font-size: .93rem; color: #555;
    line-height: 1.7; margin-bottom: 1.5rem;
  }
  .tools-feature-list { display: flex; flex-direction: column; gap: .7rem; }
  .tools-feature-row {
    display: flex; align-items: flex-start; gap: .75rem;
    background: #fff; border: 1px solid #e2e2ee;
    border-radius: 10px; padding: .7rem .9rem;
  }
  .tools-feature-icon {
    width: 34px; height: 34px; border-radius: 8px;
    background: #eef0fe; color: #3d47c8;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .tools-feature-label {
    display: block; font-family: 'Inter', sans-serif;
    font-size: .85rem; font-weight: 700; color: #111; margin-bottom: .15rem;
  }
  .tools-feature-desc {
    display: block; font-family: 'Inter', sans-serif;
    font-size: .76rem; color: #777; line-height: 1.4;
  }

  /* Maqueta del panel real */
  .tools-preview-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tools-panel-mock {
    background: #fff;
    border: 1px solid #e2e2ee;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,.1);
    width: 100%; max-width: 300px;
    overflow: hidden;
  }
  .tpm-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: .75rem 1rem; border-bottom: 1px solid #e2e2ee;
    background: #fafafa;
  }
  .tpm-title {
    font-family: 'Inter', sans-serif; font-size: .95rem;
    font-weight: 700; color: #111; letter-spacing: .03em;
  }
  .tpm-close {
    font-size: .8rem; color: #aaa; cursor: default;
  }
  .tpm-row {
    display: flex; align-items: center; gap: .75rem;
    padding: .65rem 1rem; border-bottom: 1px solid #f3f3f3;
  }
  .tpm-row:last-child { border-bottom: none; }
  .tpm-row-icon { color: #6b7280; display: flex; flex-shrink: 0; }
  .tpm-row-label {
    font-family: 'Inter', sans-serif; font-size: .84rem;
    color: #374151; flex: 1;
  }
  .tpm-toggle {
    width: 36px; height: 20px; border-radius: 10px;
    background: #d1d5db; position: relative; flex-shrink: 0;
    transition: background .2s;
  }
  .tpm-toggle--on { background: #3d47c8; }
  .tpm-thumb {
    position: absolute; top: 2px; left: 2px;
    width: 16px; height: 16px; border-radius: 50%;
    background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.2);
    transition: left .2s;
  }
  .tpm-toggle--on .tpm-thumb { left: 18px; }

  .tools-fab-mock {
    width: 54px; height: 54px; border-radius: 50%;
    background: #3d47c8;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(61,71,200,.35);
    align-self: flex-end;
  }

  /* ── Widget INCLUGO mockup (columna izquierda) ── */
  .tools-left {
    display: flex;
    flex-direction: column;
  }
  .tools-video {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px;
  }
  .wm-widget {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #ddddf5;
    box-shadow: 0 10px 40px rgba(61,71,200,.13);
    width: 100%;
    max-width: 300px;
    overflow: hidden;
  }
  .wm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .65rem 1rem;
    background: #fff;
    border-bottom: 2px solid #3d47c8;
  }
  .wm-logo-img {
    height: 26px;
    width: auto;
    display: block;
  }
  .wm-close {
    background: #f3f3f8;
    border: none;
    color: #888;
    width: 22px; height: 22px;
    border-radius: 50%;
    cursor: default;
    font-size: .75rem;
    display: flex; align-items: center; justify-content: center;
    line-height: 1;
  }
  .wm-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: .65rem;
    padding: .9rem;
  }
  .wm-tool {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .35rem;
    background: #f6f6ff;
    border: 1px solid #e5e5f5;
    border-radius: 10px;
    padding: .85rem .5rem .7rem;
  }
  .wm-tool-icon {
    width: 42px; height: 42px;
    background: #eef0fe;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: #3d47c8;
    flex-shrink: 0;
  }
  .wm-tool-label {
    font-family: 'Inter', sans-serif;
    font-size: .72rem;
    font-weight: 700;
    color: #1a1a2e;
    text-align: center;
    line-height: 1.2;
  }
  .wm-tool-desc {
    font-family: 'Inter', sans-serif;
    font-size: .63rem;
    font-weight: 400;
    color: #888;
    text-align: center;
    line-height: 1.3;
  }
  .wm-footer {
    padding: .6rem 1rem;
    border-top: 1px solid #ededf7;
    background: #fafaff;
    text-align: center;
  }
  .wm-footer-text {
    font-family: 'Inter', sans-serif;
    font-size: .71rem;
    color: #999;
  }
`;

/* ══════════════════════════════════════════════════
   GHOST HELPER
══════════════════════════════════════════════════ */
function GhostHelper() {
  const { setOverlayOpen } = useAccessibility();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
        timerRef.current = setTimeout(() => setVisible(false), 10000);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  const dismiss = (e) => {
    e.stopPropagation();
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  return (
    <>
      <style>{ghostCss}</style>
      <div
        className="gh-wrap"
        role="button"
        tabIndex={0}
        aria-label="Abrir funciones de accesibilidad"
        onClick={() => setOverlayOpen(true)}
        onKeyDown={e => e.key === "Enter" && setOverlayOpen(true)}
      >
        {/* Columna izquierda: bocadillo */}
        <div className="gh-bubble">
          <button className="gh-dismiss" onClick={dismiss} aria-label="Cerrar sugerencia">×</button>
          <strong className="gh-bubble-title">¿Necesitas ayuda?</strong>
          <p className="gh-bubble-text">Haz clic aquí para acceder a las funciones de accesibilidad.</p>
          <span className="gh-bubble-cta">
            Estamos aquí para ti&nbsp;
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{display:"inline",verticalAlign:"middle"}}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </span>
          <span className="gh-bubble-tip" aria-hidden="true"/>
        </div>

        {/* Columna derecha: fantasma + flecha curva */}
        <div className="gh-mascot">
          <img src="/img/fantas.png" alt="" className="gh-img" aria-hidden="true"/>
          <svg className="gh-arrow" width="50" height="44" viewBox="0 0 50 44" fill="none" aria-hidden="true">
            <path d="M10 6 C 14 20, 30 28, 40 38" stroke="#3d47c8" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M33 36 L41 40 L38 31" stroke="#3d47c8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </>
  );
}

const ghostCss = `
  .gh-wrap {
    position: fixed;
    bottom: 4rem;
    right: -2rem;
    z-index: 9090;
    display: flex;
    align-items: flex-end;
    gap: 0px;
    cursor: pointer;
    animation: gh-in .35s cubic-bezier(.22,1,.36,1);
  }
  @keyframes gh-in {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .gh-wrap:focus-visible { outline: 2px solid #111827; outline-offset: 4px; border-radius: 4px; }

  /* Bocadillo: alineado por la base con la chica */
  .gh-bubble {
    position: relative;
    background: #fff;
    border-radius: 16px;
    padding: 14px 16px;
    width: 210px;
    box-shadow: 0 6px 24px rgba(0,0,0,.12);
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 28px;
  }
  /* punta apuntando a la derecha (hacia la chica) */
  .gh-bubble-tip {
    position: absolute;
    right: -9px;
    bottom: 24px;
    width: 0; height: 0;
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    border-left: 10px solid #fff;
  }
  .gh-bubble-title {
    font-family: 'Inter', sans-serif;
    font-size: 1.05rem;
    font-weight: 900;
    color: #111;
    line-height: 1.2;
  }
  .gh-bubble-text {
    font-family: 'Inter', sans-serif;
    font-size: .88rem;
    font-weight: 500;
    color: #333;
    line-height: 1.5;
    margin: 0;
  }
  .gh-bubble-cta {
    font-family: 'Inter', sans-serif;
    font-size: .88rem;
    font-weight: 700;
    color: #3d47c8;
    margin-top: 4px;
  }

  /* Chica: más alta que el bocadillo */
  .gh-mascot {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    margin-left: -100px;
  }
  .gh-img {
    width: 320px;
    height: auto;
    display: block;
    transition: transform .25s;
  }
  .gh-wrap:hover .gh-img { transform: translateY(-4px); }

  /* Flecha curva desde el dedo de la chica hacia la bolita */
  .gh-arrow {
    margin-top: -18px;
    margin-right: 10px;
    animation: gh-bounce .9s ease-in-out infinite;
  }
  @keyframes gh-bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(4px); }
  }

  .gh-dismiss {
    position: absolute;
    top: -8px;
    left: -8px;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: #555;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: .85rem;
    line-height: 1;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s;
    z-index: 1;
  }
  .gh-dismiss:hover { background: #111; }
`;

/* ══════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════ */
const FAQ_ITEMS = [
  {
    q: "¿Qué es INCLUGO?",
    a: "INCLUGO nació con una idea sencilla: que nadie debería perderse un concierto, una exposición o una obra de teatro por falta de información sobre accesibilidad. Somos una plataforma que conecta a personas con discapacidad con la oferta cultural de Madrid, con filtros reales y herramientas que hacen la web más cómoda de usar para cada persona.",
  },
  {
    q: "¿La información de accesibilidad es fiable?",
    a: "Trabajamos directamente con los datos de la API oficial del Ayuntamiento de Madrid, que se actualiza a diario. Eso significa que lo que ves en INCLUGO no está sacado de una base de datos antigua ni escrito a mano: es información oficial y reciente. Aun así, siempre recomendamos confirmar con el recinto si tienes necesidades muy específicas, porque los detalles del día a día pueden cambiar.",
  },
  {
    q: "¿Cómo funcionan las herramientas de accesibilidad?",
    a: "Verás un botón ♿ fijo en la esquina de todas las páginas. Al pulsarlo se abre un pequeño panel con cuatro opciones: puedes activar que la web te lea en voz alta cada elemento al navegar con el teclado, hacer que cualquier párrafo se lea al hacer clic, mejorar el espaciado del texto para que sea más fácil de leer, o activar una máscara que resalta solo la zona de la pantalla en la que estás trabajando. Todo se guarda para tu próxima visita.",
  },
  {
    q: "¿Puedo filtrar por tipo de accesibilidad?",
    a: "Sí, ese es uno de los puntos fuertes de INCLUGO. Puedes combinar filtros de silla de ruedas, lengua de signos, audiodescripción, subtítulos, bucle magnético, braille y lectura fácil. Si un evento no tiene un recurso concreto, directamente no aparece en los resultados. Sin rodeos.",
  },
  {
    q: "¿Los eventos tienen precio de entrada?",
    a: "INCLUGO no vende entradas ni cobra comisiones. Cuando encuentras un evento que te interesa, te llevamos directamente a la web oficial del organizador para que puedas ver precios, horarios y reservar como prefieras. Muchos eventos en Madrid son además de entrada libre o gratuita.",
  },
  {
    q: "¿Está disponible en móvil?",
    a: "Sí, INCLUGO funciona bien en el móvil, la tableta y el ordenador. El diseño se adapta a cada pantalla y las herramientas de accesibilidad también están disponibles en todos los dispositivos. Si ves algo que no se ve bien en tu teléfono, cuéntanoslo: nos importa que funcione para todo el mundo.",
  },
];

function FaqSection() {
  return (
    <section className="faq-sec" aria-labelledby="faq-heading">
      <style>{faqCss}</style>
      <div className="faq-inner">
        <div className="faq-header">
          <h2 id="faq-heading" className="faq-heading">
            PREGUNTAS<br/><span className="faq-hl">FRECUENTES</span>
          </h2>
        </div>
        <div className="faq-grid">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="faq-item">
              <p className="faq-q-static">{item.q}</p>
              <p className="faq-a">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqCss = `
  .faq-sec {
    background: #fff;
    padding: clamp(3rem,6vw,5rem) clamp(1.25rem,5vw,6rem);
    border-top: 1px solid #e5e7eb;
  }
  .faq-inner {
    max-width: 1280px;
    margin: 0 auto;
  }
  .faq-header { margin-bottom: 2.5rem; }
  .faq-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 7vw, 7rem);
    letter-spacing: .02em;
    color: #111;
    line-height: .9;
    margin: .4rem 0 0;
  }
  .faq-hl { color: #3d47c8; }
  .faq-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 3rem;
  }
  @media (max-width: 640px) { .faq-grid { grid-template-columns: 1fr; } }
  .faq-item {
    border-top: 1px solid #e5e7eb;
    padding: 1.75rem 0 1.75rem 1.25rem;
    border-left: 3px solid transparent;
    transition: border-left-color .2s, padding-left .2s, background .2s;
    cursor: default;
    align-self: start;
  }
  .faq-item:hover {
    border-left-color: #3d47c8;
    padding-left: 1.75rem;
    background: #fafbff;
  }
  .faq-q-static {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #0f0f0f;
    margin: 0 0 .65rem;
    letter-spacing: -.01em;
  }
  .faq-item:hover .faq-q-static { color: #3d47c8; }
  .faq-a {
    font-family: 'Inter', sans-serif;
    font-size: .82rem;
    color: #6b7280;
    line-height: 1.75;
    padding-bottom: 0;
    margin: 0;
    letter-spacing: .01em;
  }
`;

/* ══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════ */
export default function INCLUGOHome() {
  const navigate = useNavigate();
  const [inputVal,  setInputVal]  = useState("");
  const evRef = useRef(null);

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
              La plataforma definitiva para encontrar ocio y eventos accesibles en Madrid. Filtra por tus necesidades y disfruta de la ciudad sin límites.
            </p>
            <button className="hero-cta" onClick={() => navigate("/eventos")}>
              Ver eventos
            </button>
          </div>
          <div className="hero-right" aria-hidden="true">
            <img src="/img/hero1.png" alt="" />
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
              <span className="stat-num">4</span>
              <span className="stat-label">Tipos de accesibilidad cubiertos</span>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how-sec" aria-labelledby="how-heading">
          <div className="how-inner">
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

        {/* ── HERRAMIENTAS DE ACCESIBILIDAD ── */}
        <section className="tools-sec" aria-labelledby="tools-heading">
          <style>{toolsCss}</style>
          <ToolsShowcase />
        </section>

        {/* ── ACCESIBILIDAD ── */}
        <section className="access-sec" aria-labelledby="access-heading">
          <div className="access-inner">
            <div className="access-head">
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

        {/* ── TYPES ── */}
        <section className="types-sec" aria-labelledby="types-heading">
          <div className="types-inner">
            <div className="types-head">
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
        <section className="cta-sec" aria-labelledby="cta-heading">
          <div className="cta-inner">
            <h2 id="cta-heading" className="cta-h2">DESCUBRE<br/>MADRID</h2>
            <p className="cta-sub">Más de 800 eventos culturales accesibles al alcance de todos. Sin barreras, sin frustraciones.</p>
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