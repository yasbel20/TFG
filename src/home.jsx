import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import EventsGrid  from "./eventsgrid";
import Navbar from "./Navbar";
import { WheelIcon, HandsIcon, BucleIcon, PodoIcon } from "./AccessibilityIcons";
import { useAccessibility } from "./AccessibilityContext";
import { JUNE_EVENTS } from "./juneEvents";
import "./home.css";


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
    <section className="ad-sec reveal" aria-labelledby="ad-title">
      <div className="ad-inner">
        {/* Columna izquierda: título */}
        <div className="ad-left">
          <p className="sec-eyebrow">En Madrid hoy</p>
          <h2 id="ad-title" className="ad-heading">
            AGENDA<br/><span className="ad-hl">DESTACADA</span>
          </h2>
        </div>

        {/* Columna derecha: calendario + lista */}
        <div className="ad-right">
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
                <span className="ad-ev-cat">{ev.cat}</span>
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
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════
   DATOS ESTÁTICOS
══════════════════════════════════════════════════ */
const ACCESS_INFO = {
  silla:      { label: "Silla de ruedas",   Icon: WheelIcon   },
  signos:     { label: "Lengua de signos",  Icon: HandsIcon   },
  audio:      { label: "Audiodescripción",  Icon: AudioIcon   },
  subtitulos: { label: "Subtítulos",        Icon: SubIcon     },
  bucle:      { label: "Bucle magnético",   Icon: BucleIcon   },
  podo:       { label: "Podotáctil",        Icon: PodoIcon    },
  lectura:    { label: "Lectura fácil",     Icon: EasyIcon    },
};

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
    desc: "Navega sin ratón. Usa la tecla Tab para recorrer la web y activar la lectura de voz integrada.",
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
    desc: "Escucha el contenido. Pulsa sobre cualquier texto y escúchalo en voz alta al instante.",
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
    desc: "Lectura cómoda. Modifica el tamaño y espaciado de las letras para evitar la fatiga visual.",
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
    desc: "Evita distracciones. Crea una banda de enfoque que resalta solo la línea que estás leyendo.",
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
    desc: "Contraste visual. Elimina las distracciones de color convirtiendo la interfaz a tonos de gris.",
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
        <p className="sec-eyebrow">Diseño inclusivo</p>
        <h2 id="tools-heading" className="tools-heading">
          LA WEB<br/>
          <span className="hl">QUE SE ADAPTA A TI</span><br/>
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

  return createPortal(
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
        <img src="/img/personaje1.png" alt="" className="gh-img" aria-hidden="true"/>
        <svg className="gh-arrow" width="50" height="44" viewBox="0 0 50 44" fill="none" aria-hidden="true">
          <path d="M10 6 C 14 20, 30 28, 40 38" stroke="#3d47c8" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M33 36 L41 40 L38 31" stroke="#3d47c8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>,
    document.body
  );
}


/* ══════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════ */
const FAQ_ITEMS = [
  {
    q: "¿Por qué usar INCLUGO en lugar de otras agendas?",
    a: "Olvídate de perder el tiempo buscando en la letra pequeña de cada evento para saber si puedes asistir o investigando los recintos por tu cuenta. Aquí marcas tus necesidades una sola vez y la web se encarga de mostrarte únicamente los planes que se adaptan a ti.",
  },
  {
    q: "¿La información de accesibilidad es fiable?",
    a: "Cuentas con datos oficiales del Ayuntamiento de Madrid que se actualizan a diario. No vas a encontrar información obsoleta ni aproximada: es contenido real y contrastado. Eso sí, si tus necesidades son muy específicas, te aconsejamos confirmar con el recinto antes de ir, ya que los detalles del día a día pueden cambiar.",
  },
  {
    q: "¿Cómo funcionan tus ajustes de navegación?",
    a: "Dispones de un botón azul siempre visible en la esquina inferior de la pantalla. Al pulsarlo, abres tus propios ajustes de navegación para activar la lectura en voz alta por teclado, escuchar párrafos con un clic, ampliar el texto o aislar tu lectura con la máscara de enfoque. Tu configuración se guarda automáticamente para tu próxima visita.",
  },
  {
    q: "¿Puedo filtrar por tipo de accesibilidad?",
    a: "Sí, esa es la clave de la web. Puedes combinar criterios para sillas de ruedas, lengua de signos, pavimento podotáctil, bucle magnético y más. Si un evento no ofrece el recurso exacto que necesitas, desaparece de tus resultados al instante para que navegues directo al grano y sin rodeos.",
  },
  {
    q: "¿Los eventos tienen precio de entrada?",
    a: "No pagas comisiones ni compras dentro de la web. Cuando encuentres el plan que te interesa, accedes de forma directa al canal oficial del organizador para gestionar tus pases o reservar tus entradas. Además, vas a descubrir muchísimos eventos en Madrid que son totalmente gratuitos.",
  },
  {
    q: "¿Está disponible en tu móvil?",
    a: "Por supuesto. Disfrutas de una experiencia fluida tanto en tu teléfono como en tu tableta u ordenador. El diseño de la interfaz y las herramientas de accesibilidad te acompañan vayas donde vayas. Y si encuentras algo que no se ajusta bien en tu pantalla, nos avisas; nos importa que navegues sin barreras.",
  },
];

function FaqSection() {
  return (
    <section className="faq-sec reveal" aria-labelledby="faq-heading">
      <div className="faq-inner">
        <div className="faq-header">
          <p className="sec-eyebrow">Soporte</p>
          <h2 id="faq-heading" className="faq-heading">
            TODO LO QUE<br/><span className="faq-hl">NECESITAS SABER
            </span>
          </h2>
        </div>
        <div className="faq-grid">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="faq-item" tabIndex={0}>
              <p className="faq-q-static">{item.q}</p>
              <p className="faq-a">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════ */
const COUNT_FROM = (t) => t <= 10 ? 0 : Math.floor(t * 0.85);

function useStatsCountUp(targets) {
  const [counts, setCounts] = useState(targets.map(COUNT_FROM));
  const sectionRef = useRef(null);
  const max = Math.max(...targets);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let rafIds = [];
    const runAll = () => {
      rafIds.forEach(cancelAnimationFrame);
      rafIds = [];
      targets.forEach((target, i) => {
        const duration = Math.max(300, (target / max) * 900);
        const from = COUNT_FROM(target);
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCounts(prev => { const next = [...prev]; next[i] = Math.floor(from + ease * (target - from)); return next; });
          if (progress < 1) rafIds[i] = requestAnimationFrame(tick);
          else setCounts(prev => { const next = [...prev]; next[i] = target; return next; });
        };
        rafIds[i] = requestAnimationFrame(tick);
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        runAll();
      } else {
        rafIds.forEach(cancelAnimationFrame);
        setCounts(targets.map(COUNT_FROM));
      }
    }, { threshold: 0, rootMargin: '-25% 0px -25% 0px' });
    observer.observe(el);
    return () => { observer.disconnect(); rafIds.forEach(cancelAnimationFrame); };
  }, []);

  return [counts, sectionRef];
}

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