import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AccessibilityBadge from "./AccessibilityBadge";
import { useAuth } from "./AuthContext";

// ─── Colores y hero images ────────────────────────────────────────────────────
const CAT_COLORS = {
  "Música":     "#1A1A1A", "Teatro":     "#141414",
  "Exposición": "#181818", "Cine":       "#1A1A1A",
  "Danza":      "#141414", "Cultura":    "#111111", "Deporte": "#1A1A1A",
};
const CAT_HERO = {
  "Música":     "/img/musica.jpg",
  "Teatro":     "/img/teatro.jpg",
  "Exposición": "/img/exposicion.jpg",
  "Cine":       "/img/cine.jpg",
  "Danza":      "/img/danza.jpg",
  "Cultura":    "/img/cultura.jpg",
  "Deporte":    "/img/hero.jpg",
  "Todos":      "/img/portada.jpg",
};

// ─── Iconos ───────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, fill = "none", stroke = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {typeof d === "string" ? <path d={d}/> : d}
  </svg>
);
const CalendarIcon  = () => <Ico size={11} d={<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>}/>;
const PinIcon       = () => <Ico size={11} fill="currentColor" stroke="none" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>;
const SearchIcon    = () => <Ico d={<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>}/>;
const ChevronDown   = () => <Ico size={12} d="m6 9 6 6 6-6"/>;
const ArrowRight    = () => <Ico size={13} d="M5 12h14M12 5l7 7-7 7"/>;
const CheckIcon     = () => <Ico size={15} d="M20 6 9 17l-5-5"/>;
const HeartIcon     = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill={filled ? "#e74c3c" : "none"} stroke={filled ? "#e74c3c" : "rgba(255,255,255,0.9)"}
    strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// accessibility icons
const WheelSvg  = () => <Ico size={20} fill="currentColor" stroke="none" d={<><circle cx="12" cy="5" r="2"/><path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z"/><path d="M6 16a6 6 0 1 0 12 0" fill="none" stroke="currentColor" strokeWidth="2"/></>}/>;
const EarSvg    = () => <Ico size={20} d={<><path d="M6 8.5a6 6 0 1 1 11.6 2c-.5 1.7-1.9 2.9-2.6 4.5-.4.9-.4 1.5-.4 2h-1"/><path d="M9 17a3 3 0 0 0 6 0"/></>}/>;
const EyeSvg    = () => <Ico size={20} d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}/>;
const SignosSvg = () => <Ico size={20} d={<><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>}/>;
const BrainSvg  = () => <Ico size={20} d={<><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.97-3 2.5 2.5 0 0 1-1.2-4.66 2.5 2.5 0 0 1 .81-4.6A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.97-3 2.5 2.5 0 0 0 1.2-4.66 2.5 2.5 0 0 0-.81-4.6A2.5 2.5 0 0 0 14.5 2z"/></>}/>;
const BookSvg   = () => <Ico size={20} d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>}/>;

const ACC_OPTIONS = [
  { key: "silla",  label: "Movilidad",        Icon: WheelSvg  },
  { key: "bucle",  label: "Audición",         Icon: EarSvg    },
  { key: "podo",   label: "Visual",           Icon: EyeSvg    },
  { key: "signos", label: "Lengua de signos", Icon: SignosSvg },
  { key: "mental", label: "Psicológico",      Icon: BrainSvg  },
  { key: "facil",  label: "Lectura fácil",    Icon: BookSvg   },
];

// ─── Parser ───────────────────────────────────────────────────────────────────
function parseEvent(item, i) {
  const desc = ((item.description || "") + " " + (item.organization?.["organization-name"] || "")).toLowerCase();
  const t = (item.title || "").toLowerCase();
  let cat = "Cultura";
  if (/concierto|música|jazz|flamenco|rock|pop/.test(t + desc)) cat = "Música";
  else if (/teatro|obra|ballet|ópera/.test(t + desc))           cat = "Teatro";
  else if (/exposici|muestra|exhibit|galería/.test(t + desc))   cat = "Exposición";
  else if (/cine|film|pelícu/.test(t + desc))                   cat = "Cine";
  else if (/danza|baile/.test(t + desc))                        cat = "Danza";
  else if (/deporte|sport|carrera|maratón/.test(t + desc))      cat = "Deporte";

  const accRaw = item.organization?.["accesibility"] || "";
  const codes  = accRaw.toString().split(",").map(c => c.trim()).filter(Boolean);
  const access = [];
  if (codes.includes("1") || codes.includes("2")) access.push("silla");
  if (codes.includes("4"))  access.push("signos");
  if (codes.includes("5"))  access.push("podo");
  if (codes.includes("6"))  access.push("bucle");

  let price = "Gratis";
  const fee = item["event-free"] ?? item.free;
  if (fee === false || fee === "false" || fee === 0 || fee === "0") {
    const raw = String(item["event-fee"] || item.price || "").trim();
    price = /^\d+([.,]\d+)?$/.test(raw) ? `Desde ${raw.replace(",", ".")} €` : "Ver precio";
  }

  let dateShort = "Consultar";
  let date      = "Consultar fecha";
  let timeStr   = "";
  if (item.dtstart) {
    const s   = new Date(item.dtstart);
    const e   = item.dtend ? new Date(item.dtend) : null;
    const fmt = { day: "numeric", month: "short" };
    const fmtF= { day: "numeric", month: "long", year: "numeric" };
    dateShort = s.toLocaleDateString("es-ES", fmt).toUpperCase();
    date      = s.toLocaleDateString("es-ES", fmtF);
    if (e && e.toDateString() !== s.toDateString()) {
      dateShort = `${s.toLocaleDateString("es-ES", fmt)} – ${e.toLocaleDateString("es-ES", fmt)}`.toUpperCase();
      date = `${date} – ${e.toLocaleDateString("es-ES", fmtF)}`;
    }
    const h = s.getHours(), m = s.getMinutes();
    if (h !== 0 || m !== 0)
      timeStr = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} h`;
  }

  const BASE_IMG = "https://www.madrid.es";
  const rawImg = item.media?.["@id"] || item.image || item.media?.url || null;
  const image = rawImg
    ? (rawImg.startsWith("http") ? rawImg : BASE_IMG + rawImg)
    : null;

  const venue = item.location?.["street-address"]
    || item.organization?.["organization-name"]
    || "Madrid";

  const startDate = item.dtstart ? new Date(item.dtstart) : null;
  const endDate   = item.dtend   ? new Date(item.dtend)   : startDate;

  return {
    id:       item.id || `ev-${i}`,
    title:    item.title || "Evento sin título",
    cat, dateShort, date, timeStr, price, access, image,
    startDate, endDate,
    url:      item.link || "#",
    venue:    venue.length > 40 ? venue.slice(0, 38) + "…" : venue,
    venueRaw: venue,
    district: item.address?.["locality"] || "Madrid",
    org:      item.organization?.["organization-name"] || "",
    descFull: (item.description || "").replace(/<[^>]+>/g, "").trim(),
  };
}

const SAMPLE = [
  { id:1, title:"Jazz en el Conde Duque",       cat:"Música",     dateShort:"12 ABR",       date:"12 de abril de 2026",  timeStr:"20:00 h", venue:"C.C. Conde Duque",        district:"Centro",   price:"Gratis", access:["silla","signos"], image:null, url:"#", org:"", descFull:"" },
  { id:2, title:"Picasso: Miradas múltiples",   cat:"Exposición", dateShort:"HASTA 30 ABR", date:"Hasta 30 de abril",    timeStr:"",        venue:"Museo Reina Sofía",       district:"Atocha",   price:"12 €",   access:["silla","bucle"],  image:null, url:"#", org:"", descFull:"" },
  { id:3, title:"La Casa de Bernarda Alba",     cat:"Teatro",     dateShort:"18–20 ABR",    date:"18 al 20 de abril",    timeStr:"19:30 h", venue:"Teatro Español",          district:"Centro",   price:"15 €",   access:["signos"],         image:null, url:"#", org:"", descFull:"" },
  { id:4, title:"Cine: Todo sobre mi madre",    cat:"Cine",       dateShort:"15 ABR",       date:"15 de abril de 2026",  timeStr:"18:00 h", venue:"Filmoteca Española",      district:"Lavapiés", price:"3 €",    access:["bucle"],          image:null, url:"#", org:"", descFull:"" },
  { id:5, title:"Concierto flamenco accesible", cat:"Música",     dateShort:"20 ABR",       date:"20 de abril de 2026",  timeStr:"21:00 h", venue:"Café de las Artes",       district:"Malasaña", price:"10 €",   access:["silla"],          image:null, url:"#", org:"", descFull:"" },
  { id:6, title:"Feria del Libro de Madrid",    cat:"Cultura",    dateShort:"24 ABR–1 MAY", date:"24 de abril – 1 mayo", timeStr:"",        venue:"Parque del Retiro",       district:"Retiro",   price:"Gratis", access:["silla"],          image:null, url:"#", org:"", descFull:"" },
  { id:7, title:"Noche de Danza Contemporánea", cat:"Danza",      dateShort:"22 ABR",       date:"22 de abril de 2026",  timeStr:"",        venue:"Teatro del Canal",        district:"Chamberí", price:"18 €",   access:["silla","signos"], image:null, url:"#", org:"", descFull:"" },
  { id:8, title:"Exposición: Carteles Madrid",  cat:"Exposición", dateShort:"TODO ABR",     date:"Todo abril",           timeStr:"",        venue:"Círculo de Bellas Artes", district:"Centro",   price:"Gratis", access:["silla"],          image:null, url:"#", org:"", descFull:"" },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
function useEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch("/api-madrid/egob/catalogo/206974-0-agenda-eventos-culturales-100.json")
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const parsed = (data["@graph"] || []).map(parseEvent).filter(e => e.access.length > 0);
        setAllEvents(parsed);
        setLoading(false);
      })
      .catch(() => { setAllEvents(SAMPLE); setLoading(false); });
  }, []);

  return {
    byCategory: (cat) => cat === "Todos" ? allEvents : allEvents.filter(e => e.cat === cat),
    loading,
    total: allEvents.length,
  };
}

// ─── Dropdown de filtro reutilizable ─────────────────────────────────────────
function FilterDropdown({ label, active, onClear, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="ep-dd-wrap" ref={ref}>
      <button
        className={`ep-filter-btn${active ? " ep-filter-btn--on" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {label}
        {active && <span className="ep-filter-dot" aria-hidden="true"/>}
        <ChevronDown/>
      </button>
      {open && (
        <div className="ep-dd-panel" role="dialog" aria-label={`Filtro: ${label}`}>
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}

// ─── Tarjeta destacada ────────────────────────────────────────────────────────
function FeaturedCard({ ev, onOpenDetail }) {
  const [imgOk, setImgOk] = useState(!!ev.image);
  const { user, favIds, addFav, removeFav } = useAuth();
  const isFav = favIds.has(String(ev.id));

  return (
    <div className="ep-feat-card" onClick={() => onOpenDetail(ev)}
      role="button" tabIndex={0} aria-label={`Ver ${ev.title}`}
      onKeyDown={e => e.key === "Enter" && onOpenDetail(ev)}>
      <div className="ep-feat-img-wrap">
        {ev.image && imgOk
          ? <img src={ev.image} alt={ev.title} className="ep-feat-img" onError={() => setImgOk(false)} loading="lazy"/>
          : <div className="ep-feat-fallback" style={{ background: CAT_COLORS[ev.cat] || "#111" }}><div className="ep-fallback-pattern"/></div>
        }
        <div className="ep-feat-gradient"/>
        <span className="ep-feat-cat-badge">{ev.cat}</span>
        {user && (
          <button className={`ep-fav-btn${isFav ? " ep-fav-on" : ""}`}
            aria-label={isFav ? "Quitar de favoritos" : "Guardar"}
            onClick={e => { e.stopPropagation(); isFav ? removeFav(ev.id) : addFav(ev); }}>
            <HeartIcon filled={isFav}/>
          </button>
        )}
        <div className="ep-feat-info">
          <h3 className="ep-feat-title">{ev.title}</h3>
          <div className="ep-feat-meta">
            <CalendarIcon/>{ev.dateShort}
            {ev.venue && <><span className="ep-feat-dot">·</span><PinIcon/>{ev.venue}</>}
          </div>
          <div className="ep-feat-bottom">
            <AccessibilityBadge types={ev.access} className="ep-feat-access"/>
            {ev.price === "Gratis" && <span className="ep-feat-free">Gratis</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tarjeta grid ─────────────────────────────────────────────────────────────
function GridCard({ ev, onOpenDetail }) {
  const [imgOk, setImgOk] = useState(!!ev.image);
  const { user, favIds, addFav, removeFav } = useAuth();
  const isFav = favIds.has(String(ev.id));

  return (
    <div className="ep-card" onClick={() => onOpenDetail(ev)}
      role="button" tabIndex={0} aria-label={`Ver ${ev.title}`}
      onKeyDown={e => e.key === "Enter" && onOpenDetail(ev)}>
      <div className="ep-img-wrap">
        {ev.image && imgOk
          ? <img src={ev.image} alt={ev.title} className="ep-img" onError={() => setImgOk(false)} loading="lazy"/>
          : <div className="ep-img-fallback ep-img-noimg"><span className="ep-noimg-cat">{ev.cat}</span></div>
        }
        {user && (
          <button className={`ep-fav-btn${isFav ? " ep-fav-on" : ""}`}
            aria-label={isFav ? "Quitar de favoritos" : "Guardar"}
            onClick={e => { e.stopPropagation(); isFav ? removeFav(ev.id) : addFav(ev); }}>
            <HeartIcon filled={isFav}/>
          </button>
        )}
      </div>
      <div className="ep-info">
        <span className="ep-cat">{ev.cat}</span>
        <h3 className="ep-title">{ev.title}</h3>
        <AccessibilityBadge types={ev.access} className="ep-access-chip"
          style={{color:"#6b7280"}}/>
        <div className="ep-meta-block">
          <span className="ep-meta-row"><CalendarIcon/>{ev.dateShort}</span>
          <span className="ep-meta-row ep-meta-venue"><PinIcon/>{ev.venue}</span>
        </div>
        <div className="ep-bottom-row">
          {ev.price === "Gratis"
            ? <span className="ep-price-free">Gratis</span>
            : <span className="ep-price-paid">{ev.price}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard({ featured }) {
  if (featured) return (
    <div className="ep-feat-card" style={{pointerEvents:"none"}}>
      <div className="ep-feat-img-wrap"><div className="ep-skel" style={{width:"100%",height:"100%"}}/></div>
    </div>
  );
  return (
    <div className="ep-card" style={{pointerEvents:"none"}}>
      <div className="ep-img-wrap"><div className="ep-skel" style={{width:"100%",height:"100%",borderRadius:0}}/></div>
      <div className="ep-info">
        <div className="ep-skel" style={{width:"40%",height:10}}/>
        <div className="ep-skel" style={{width:"90%",height:16,margin:"6px 0"}}/>
        <div className="ep-skel" style={{width:"60%",height:10}}/>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
const SLUG_TO_CAT = {
  "musica":"Música","teatro":"Teatro","exposicion":"Exposición",
  "cine":"Cine","danza":"Danza","cultura":"Cultura",
};

export default function EventsPage() {
  const { cat: catSlug } = useParams();
  const navigate          = useNavigate();
  const resolvedCat       = catSlug ? (SLUG_TO_CAT[catSlug] || "Todos") : "Todos";
  const [activeCategory, setActiveCategory] = useState(resolvedCat);
  const [searchQ,        setSearchQ]        = useState("");
  const [activeAccess,   setActiveAccess]   = useState(null);
  const [dateFilter,     setDateFilter]     = useState(null);  // null | "hoy" | "semana" | "finde" | "mes"
  const [priceFilter,    setPriceFilter]    = useState(null);  // null | "gratis" | "pago"

  useEffect(() => {
    setActiveCategory(resolvedCat);
    setSearchQ("");
    setActiveAccess(null);
    setDateFilter(null);

    setPriceFilter(null);
  }, [resolvedCat]);

  const { byCategory, loading } = useEvents();
  const openDetail = ev => navigate(`/evento/${ev.id}`, { state: { ev } });

  const allForCat = byCategory(activeCategory);
  let filtered = allForCat;

  if (searchQ.trim()) {
    const q = searchQ.toLowerCase();
    filtered = filtered.filter(ev =>
      ev.title.toLowerCase().includes(q) ||
      ev.venue.toLowerCase().includes(q) ||
      ev.district.toLowerCase().includes(q)
    );
  }

  if (activeAccess) {
    filtered = filtered.filter(ev => ev.access.includes(activeAccess));
  }


  if (priceFilter === "gratis") {
    filtered = filtered.filter(ev => ev.price === "Gratis");
  } else if (priceFilter === "pago") {
    filtered = filtered.filter(ev => ev.price !== "Gratis");
  }

  if (dateFilter) {
    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    filtered = filtered.filter(ev => {
      if (!ev.startDate) return false;
      const s = new Date(ev.startDate.getFullYear(), ev.startDate.getMonth(), ev.startDate.getDate());
      const e = ev.endDate
        ? new Date(ev.endDate.getFullYear(), ev.endDate.getMonth(), ev.endDate.getDate())
        : s;
      if (dateFilter === "hoy") {
        return s <= today && e >= today;
      }
      if (dateFilter === "semana") {
        const limit = new Date(today); limit.setDate(today.getDate() + 7);
        return s <= limit && e >= today;
      }
      if (dateFilter === "finde") {
        const dow  = today.getDay();
        const sat  = new Date(today); sat.setDate(today.getDate() + (dow === 6 ? 0 : 6 - dow));
        const sun  = new Date(sat); sun.setDate(sat.getDate() + (dow === 0 ? 0 : 1));
        return s <= sun && e >= sat;
      }
      if (dateFilter === "mes") {
        return s.getMonth() === today.getMonth() && s.getFullYear() === today.getFullYear()
          || (s <= today && e.getMonth() === today.getMonth() && e.getFullYear() === today.getFullYear());
      }
      return true;
    });
  }

  const freeCount = filtered.filter(e => e.price === "Gratis").length;
  const featured  = filtered.slice(0, 8);
  const catLabel  = activeCategory === "Todos" ? "Todos los eventos" : activeCategory;

  const DATE_OPTS = [
    { key: "hoy",    label: "Hoy" },
    { key: "finde",  label: "Este fin de semana" },
    { key: "semana", label: "Esta semana" },
    { key: "mes",    label: "Este mes" },
  ];
  const ACC_FILTER_OPTS = [
    { key: "silla",  label: "Silla de ruedas" },
    { key: "bucle",  label: "Bucle magnético" },
    { key: "podo",   label: "Podotáctil" },
    { key: "signos", label: "Lengua de signos" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="ep-page">
        <Navbar/>

        {/* ── Hero ── */}
        <section className="ep-hero" style={{backgroundImage:`url(${CAT_HERO[activeCategory]||CAT_HERO["Todos"]})`}}>
          <div className="ep-hero-overlay"/>
          <div className="ep-hero-inner">

            <div className="ep-hero-left">
              <h1 className="ep-hero-title">{catLabel}</h1>
              <p className="ep-hero-sub">Eventos culturales accesibles para todas las personas</p>
              <div className="ep-hero-stats">
                <div className="ep-stat-item">
                  <strong>{loading ? "—" : filtered.length}</strong>
                  <span>eventos</span>
                </div>
                <span className="ep-stat-sep"/>
                <div className="ep-stat-item">
                  <strong>{loading ? "—" : freeCount}</strong>
                  <span>gratis</span>
                </div>
              </div>
            </div>


          </div>
        </section>

        {/* ── Filter bar ── */}
        <div className="ep-filterbar">
          <div className="ep-filterbar-inner">
            <label className="ep-search-wrap" htmlFor="ep-search">
              <SearchIcon/>
              <input id="ep-search" className="ep-search"
                placeholder="Buscar eventos, artistas, lugares..."
                value={searchQ} onChange={e => setSearchQ(e.target.value)}/>
            </label>

            {/* Fechas */}
            <FilterDropdown
              label={dateFilter ? DATE_OPTS.find(o => o.key === dateFilter)?.label : "Fechas"}
              active={!!dateFilter}
              onClear={() => setDateFilter(null)}
            >
              {({ close }) => (
                <>
                  {DATE_OPTS.map(o => (
                    <button key={o.key}
                      className={`ep-dd-opt${dateFilter === o.key ? " ep-dd-opt--on" : ""}`}
                      onClick={() => { setDateFilter(dateFilter === o.key ? null : o.key); close(); }}>
                      {o.label.toUpperCase()}
                    </button>
                  ))}
                </>
              )}
            </FilterDropdown>

            {/* Accesibilidad */}
            <FilterDropdown
              label={activeAccess ? ACC_FILTER_OPTS.find(o => o.key === activeAccess)?.label ?? "Accesibilidad" : "Accesibilidad"}
              active={!!activeAccess}
              onClear={() => setActiveAccess(null)}
            >
              {({ close }) => (
                <>
                  {ACC_FILTER_OPTS.map(o => (
                    <button key={o.key}
                      className={`ep-dd-opt${activeAccess === o.key ? " ep-dd-opt--on" : ""}`}
                      onClick={() => { setActiveAccess(activeAccess === o.key ? null : o.key); close(); }}>
                      {o.label.toUpperCase()}
                    </button>
                  ))}
                </>
              )}
            </FilterDropdown>

            {/* Más filtros */}
            <FilterDropdown
              label="Más filtros"
              active={!!priceFilter}
              onClear={() => setPriceFilter(null)}
            >
              {({ close }) => (
                <>
                  {[["gratis","GRATIS"],["pago","DE PAGO"]].map(([k,l]) => (
                    <button key={k}
                      className={`ep-dd-opt${priceFilter === k ? " ep-dd-opt--on" : ""}`}
                      onClick={() => { setPriceFilter(priceFilter === k ? null : k); close(); }}>
                      {l}
                    </button>
                  ))}
                </>
              )}
            </FilterDropdown>

          </div>
        </div>




        {/* ── Eventos próximos ── */}
        <section className="ep-section ep-main-section">
          <div className="ep-section-head">
            <div>
              <h2 className="ep-section-title">Eventos próximos</h2>
              <p className="ep-section-sub">
                {loading ? "Cargando eventos…" : `${filtered.length} eventos encontrados`}
              </p>
            </div>
          </div>
          <div className="ep-grid">
            {loading
              ? Array.from({length:12}).map((_,i) => <SkeletonCard key={i}/>)
              : filtered.length === 0
                ? <p className="ep-empty">No hay eventos para esta selección.</p>
                : filtered.map(ev => <GridCard key={ev.id} ev={ev} onOpenDetail={openDetail}/>)
            }
          </div>
        </section>

      </div>
    </>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const css = `
  .ep-page { min-height:100vh; background:#ffffff; font-family:'Inter',var(--ff-b),system-ui,sans-serif; }
  .hi-contrast .ep-page { background:var(--bg-surface); }

  /* ── Hero ── */
  .ep-hero {
    position:relative; width:100%; height:440px;
    background-size:cover; background-position:center; transition:background-image .4s;
  }
  .ep-hero-overlay {
    position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(8,10,35,.55) 0%,rgba(15,20,60,.42) 55%,rgba(8,10,35,.50) 100%);
  }
  .ep-hero-inner {
    position:absolute; inset:0;
    max-width:1280px; margin:0 auto;
    padding:2.5rem clamp(1.25rem,5vw,6rem);
    display:flex; align-items:center; justify-content:space-between; gap:2rem;
  }
  .ep-hero-left { flex:1; min-width:0; }
  .ep-hero-tag {
    display:inline-flex; align-items:center; gap:.4rem;
    border:1.5px solid rgba(255,255,255,.28); background:rgba(255,255,255,.08);
    color:rgba(255,255,255,.9); font-size:.75rem; font-weight:700;
    letter-spacing:.14em; text-transform:uppercase;
    padding:.3rem .75rem; border-radius:0; margin-bottom:.875rem;
  }
  .ep-hero-title {
    font-family:'Bebas Neue',var(--ff-h),sans-serif; font-weight:400;
    font-size:clamp(2.4rem,5.5vw,4.2rem); letter-spacing:.02em;
    color:#fff; line-height:1; margin:0 0 .7rem;
  }
  .ep-hero-sub {
    font-size:1rem; color:rgba(255,255,255,.68);
    margin:0 0 1.75rem; line-height:1.55; max-width:400px;
  }
  .ep-hero-stats { display:flex; align-items:center; gap:1.25rem; }
  .ep-stat-item { display:flex; flex-direction:column; line-height:1.2; }
  .ep-stat-item strong { font-size:1.5rem; font-weight:800; color:#fff; }
  .ep-stat-item span { font-size:.75rem; font-weight:500; color:rgba(255,255,255,.55); text-transform:uppercase; letter-spacing:.08em; }
  .ep-stat-sep { width:1px; height:30px; background:rgba(255,255,255,.18); flex-shrink:0; }

  /* Accessibility panel */
  .ep-acc-panel {
    flex-shrink:0; width:340px;
    background:var(--brand); border-radius:16px;
    padding:1.5rem; box-shadow:0 8px 40px rgba(61,71,200,.4);
  }
  .ep-acc-panel-q { font-size:.9rem; font-weight:700; color:rgba(255,255,255,.9); margin:0 0 1.1rem; line-height:1.45; }
  .ep-acc-panel-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:.5rem; }
  .ep-acc-opt {
    display:flex; flex-direction:column; align-items:center; gap:.4rem;
    padding:.7rem .4rem; border-radius:10px;
    border:1.5px solid rgba(255,255,255,.22); background:transparent;
    color:rgba(255,255,255,.8); font-family:'Inter',var(--ff-b),sans-serif;
    font-size:.75rem; font-weight:600; cursor:pointer;
    transition:all .15s; text-align:center;
  }
  .ep-acc-opt:hover { background:rgba(255,255,255,.14); border-color:rgba(255,255,255,.45); color:#fff; }
  .ep-acc-opt--on { background:rgba(255,255,255,.2); border-color:#fff; color:#fff; }
  .ep-acc-opt-icon {
    width:32px; height:32px; border-radius:8px;
    background:rgba(255,255,255,.12);
    display:flex; align-items:center; justify-content:center;
  }

  /* ── Filter bar ── */
  .ep-filterbar { background:#ffffff; border-bottom:1px solid var(--border); padding:.75rem clamp(1.25rem,5vw,6rem); }
  .hi-contrast .ep-filterbar { background:var(--bg-surface); }
  .ep-filterbar-inner {
    max-width:1280px; margin:0 auto;
    display:flex; align-items:center; gap:.6rem; flex-wrap:wrap;
  }
  .ep-search-wrap {
    display:flex; align-items:center; gap:.5rem;
    border:1px solid var(--border); border-radius:0;
    padding:.48rem .9rem; background:#fff;
    flex:1; min-width:160px; max-width:300px;
    color:var(--text-muted); transition:border-color .15s; cursor:text;
  }
  .ep-search-wrap:focus-within { border-color:var(--brand); box-shadow:var(--focus-ring); }
  .ep-search {
    border:none; outline:none; background:transparent;
    font-family:'Inter',var(--ff-b),sans-serif; font-size:.87rem; color:var(--text-primary); width:100%;
  }
  .ep-search::placeholder { color:var(--text-muted); }
  .ep-filter-btn {
    display:inline-flex; align-items:center; gap:.4rem;
    padding:.45rem .9rem; border-radius:0;
    border:1px solid var(--border); background:#fff;
    color:var(--text-secondary); font-family:var(--ff-b);
    font-size:.78rem; font-weight:600; cursor:pointer; text-transform:uppercase; letter-spacing:.1em;
    transition:all .15s; white-space:nowrap;
  }
  .ep-filter-btn:hover { border-color:var(--brand); color:var(--brand); }

  /* ── Sections ── */
  .ep-section { max-width:1280px; margin:0 auto; padding:2.5rem clamp(1.25rem,5vw,6rem); }
  .ep-section-head {
    display:flex; align-items:flex-end; justify-content:space-between;
    margin-bottom:1.5rem; gap:1rem; flex-wrap:wrap;
  }
  .ep-section-title { font-family:'Bebas Neue',var(--ff-h),sans-serif; font-weight:400; font-size:1.55rem; letter-spacing:.04em; color:var(--text-primary); margin:0 0 .2rem; }
  .ep-section-sub { font-size:.87rem; color:var(--text-muted); margin:0; }
  .ep-see-all {
    display:inline-flex; align-items:center; gap:.35rem;
    font-family:'Inter',var(--ff-b),sans-serif; font-size:.87rem; font-weight:600; color:var(--brand);
    background:none; border:none; cursor:pointer; white-space:nowrap;
    transition:gap .15s;
  }
  .ep-see-all:hover { gap:.55rem; }

  /* ── Featured track ── */
  .ep-feat-track {
    display:flex; gap:1.25rem;
    overflow-x:auto; padding-bottom:.75rem;
    scrollbar-width:none;
  }
  .ep-feat-track::-webkit-scrollbar { display:none; }

  .ep-feat-card {
    flex-shrink:0; width:210px; border-radius:12px;
    overflow:hidden; cursor:pointer;
    transition:transform .2s, box-shadow .2s;
  }
  .ep-feat-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.2); }
  .ep-feat-img-wrap { position:relative; width:100%; height:295px; }
  .ep-feat-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .35s; }
  .ep-feat-card:hover .ep-feat-img { transform:scale(1.04); }
  .ep-feat-fallback { width:100%; height:100%; }
  .ep-feat-gradient {
    position:absolute; inset:0;
    background:linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.55) 65%,rgba(0,0,0,.88) 100%);
  }
  .ep-feat-cat-badge {
    position:absolute; top:10px; left:10px;
    background:var(--brand); color:#fff;
    font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    padding:.25rem .6rem; border-radius:4px;
  }
  .ep-feat-info { position:absolute; bottom:0; left:0; right:0; padding:.875rem; }
  .ep-feat-title {
    font-family:'Inter',var(--ff-b),sans-serif; font-weight:700; font-size:1rem; color:#fff;
    line-height:1.25; margin:0 0 .35rem;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  }
  .ep-feat-meta {
    display:flex; align-items:center; gap:.3rem;
    font-size:.75rem; color:rgba(255,255,255,.72); margin-bottom:.45rem; flex-wrap:wrap;
  }
  .ep-feat-dot { color:rgba(255,255,255,.35); }
  .ep-feat-bottom { display:flex; align-items:center; justify-content:space-between; gap:.5rem; }
  .ep-feat-free { font-size:.72rem; font-weight:700; color:#4ade80; letter-spacing:.06em; text-transform:uppercase; flex-shrink:0; }

  /* ── CTA band ── */
  .ep-cta-band {
    background:var(--bg-surface); border-top:1px solid var(--border); border-bottom:1px solid var(--border);
    padding:2.5rem clamp(1.25rem,5vw,6rem);
  }
  .ep-cta-inner { max-width:1280px; margin:0 auto; display:flex; align-items:center; gap:3rem; flex-wrap:wrap; }
  .ep-cta-text { flex:1; min-width:240px; }
  .ep-cta-eyebrow {
    display:inline-block; background:var(--brand-subtle); color:var(--brand);
    font-size:.72rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
    padding:.25rem .75rem; border-radius:0; margin-bottom:.875rem;
  }
  .ep-cta-heading { font-family:'Bebas Neue',var(--ff-h),sans-serif; font-weight:400; font-size:1.7rem; letter-spacing:.04em; color:var(--text-primary); margin:0 0 .6rem; line-height:1.2; }
  .ep-cta-desc { font-size:.95rem; color:var(--text-muted); line-height:1.65; margin:0 0 1.25rem; max-width:370px; }
  .ep-cta-btn {
    display:inline-flex; align-items:center; gap:.5rem;
    background:var(--text-primary); color:#fff;
    font-family:'Inter',var(--ff-b),sans-serif; font-size:.9rem; font-weight:600;
    padding:.75rem 1.5rem; border-radius:8px; border:none; cursor:pointer; transition:background .15s;
  }
  .ep-cta-btn:hover { background:#222; }
  .ep-trust-grid { display:flex; flex-direction:column; gap:1rem; flex-shrink:0; }
  .ep-trust-item { display:flex; align-items:flex-start; gap:.75rem; }
  .ep-trust-icon {
    width:32px; height:32px; border-radius:8px;
    background:var(--brand-subtle); color:var(--brand);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .ep-trust-item div { display:flex; flex-direction:column; gap:.12rem; }
  .ep-trust-item strong { font-size:.9rem; font-weight:700; color:var(--text-primary); display:block; }
  .ep-trust-item span { font-size:.82rem; color:var(--text-muted); display:block; }

  /* ── Explore grid ── */
  .ep-explore-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:1rem; }
  .ep-explore-card {
    display:flex; flex-direction:column; align-items:center; gap:.75rem;
    padding:1.25rem 1rem; border:1.5px solid var(--border); border-radius:12px;
    background:#fff; cursor:pointer; transition:all .15s; font-family:'Inter',var(--ff-b),sans-serif;
  }
  .ep-explore-card:hover {
    border-color:var(--brand); background:var(--brand-subtle);
    transform:translateY(-2px); box-shadow:0 4px 16px rgba(61,71,200,.1);
  }
  .ep-explore-card--on { background:var(--brand-subtle); border-color:var(--brand); }
  .ep-explore-icon {
    width:48px; height:48px; border-radius:12px;
    background:var(--brand-subtle); color:var(--brand);
    display:flex; align-items:center; justify-content:center;
  }
  .ep-explore-card--on .ep-explore-icon { background:var(--brand); color:#fff; }
  .ep-explore-label { font-size:.85rem; font-weight:600; color:var(--text-secondary); }
  .ep-explore-card--on .ep-explore-label { color:var(--brand); }

  /* ── Main events grid ── */
  .ep-main-section { padding-bottom:5rem; }
  .ep-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1.75rem 1.5rem; }
  .ep-empty { grid-column:1/-1; text-align:center; color:var(--text-tertiary); font-size:.9rem; padding:4rem 0; }

  /* ── Grid card ── */
  .ep-card { display:flex; flex-direction:column; cursor:pointer; transition:transform .2s; border:none; background:transparent; overflow:visible; padding:0; text-align:left; }
  .ep-card:hover { transform:translateY(-4px); }
  .ep-fav-btn {
    position:absolute; top:8px; right:8px;
    width:32px; height:32px; border-radius:50%;
    background:rgba(0,0,0,.45); border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:background .15s, transform .15s; backdrop-filter:blur(4px);
  }
  .ep-fav-btn:hover { background:rgba(0,0,0,.7); transform:scale(1.1); }
  .ep-fav-on { background:rgba(220,38,38,.2)!important; }
  .ep-img-wrap { position:relative; width:100%; height:290px; overflow:hidden; flex-shrink:0; }
  .ep-img { width:100%; height:100%; object-fit:cover; transition:transform .35s; display:block; }
  .ep-card:hover .ep-img { transform:scale(1.04); }
  .ep-img-fallback { width:100%; height:100%; }
  .ep-img-noimg {
    background: #f0eefb;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .6rem;
  }
  .ep-img-noimg::before {
    content: "";
    display: block;
    width: 48px; height: 48px;
    background: var(--brand-subtle);
    border-radius: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233D47C8' stroke-width='1.8' stroke-linecap='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 24px;
  }
  .ep-noimg-cat {
    font-family: var(--ff-b); font-size: .72rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; color: var(--brand);
    opacity: .7;
  }
  .ep-info { padding:.75rem 0 .5rem; display:flex; flex-direction:column; gap:0; flex:1; }
  .ep-cat { font-family:'Inter',var(--ff-b),sans-serif; font-size:.73rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--brand); margin-bottom:.3rem; }
  .ep-title {
    font-family:'Bebas Neue',var(--ff-h),sans-serif; font-weight:400; font-size:1.45rem; letter-spacing:.04em;
    color:var(--text-primary); line-height:1.15; margin:0 0 .5rem;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  }
  .ep-meta-block { display:flex; flex-direction:column; gap:.18rem; margin-bottom:.5rem; }
  .ep-meta-row { display:flex; align-items:center; gap:5px; font-size:.82rem; color:var(--text-muted); }
  .ep-meta-venue { color:var(--text-tertiary); }
  .ep-bottom-row { display:flex; align-items:center; padding-top:.4rem; border-top:1px solid var(--border); margin-top:auto; }
  .ep-price-free { font-size:.75rem; font-weight:700; letter-spacing:.06em; color:var(--success); }
  .ep-price-paid { font-size:.75rem; font-weight:700; color:var(--text-primary); }
  .ep-access-chip { margin-bottom:.45rem; }

  /* ── Skeleton ── */
  .ep-skel {
    background:linear-gradient(90deg,var(--border) 25%,var(--bg-surface) 50%,var(--border) 75%);
    background-size:200%; animation:epskel 1.4s infinite; border-radius:2px; margin-bottom:.5rem;
  }
  @keyframes epskel { 0%{background-position:200% 0}100%{background-position:-200% 0} }

  /* ── Filter dropdowns ── */
  .ep-dd-wrap { position:relative; }
  .ep-filter-btn--on {
    background:var(--brand-subtle); border-color:var(--brand); color:var(--brand); font-weight:600;
  }
  .ep-filter-dot {
    width:6px; height:6px; border-radius:50%;
    background:var(--brand); flex-shrink:0;
  }
  .ep-dd-panel {
    position:absolute; top:calc(100% + .75rem + 1px); left:0;
    background:var(--bg); border:1px solid var(--border); border-radius:0;
    box-shadow:0 8px 32px rgba(0,0,0,.12);
    min-width:210px; z-index:300; padding:0; overflow:hidden;
    animation:ep-dd-in .14s ease;
  }
  @keyframes ep-dd-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  .ep-dd-heading {
    font-size:.75rem; font-weight:700; letter-spacing:.09em; text-transform:uppercase;
    color:var(--text-muted); margin:0; padding:.6rem .9rem .5rem;
  }
  .ep-dd-scroll { max-height:200px; overflow-y:auto; }
  .ep-dd-opt {
    display:flex; align-items:center; width:100%;
    padding:.5rem .9rem; border-radius:0;
    background:none; border:none; cursor:pointer;
    font-family:var(--ff-b); font-size:.78rem; font-weight:600; letter-spacing:.1em; color:var(--text-secondary);
    text-align:left; transition:background .1s, color .1s;
  }
  .ep-dd-opt:hover { background:var(--brand-subtle); color:var(--brand); }
  .ep-dd-opt--on { background:var(--brand-subtle); color:var(--brand); font-weight:600; }
  .ep-dd-empty { font-size:.82rem; color:var(--text-muted); padding:.25rem .9rem; margin:0; }
  .ep-dd-clear {
    display:block; width:100%; margin-top:0; border-top:1px solid var(--border);
    padding:.5rem .9rem; font-family:'Inter',var(--ff-b),sans-serif; font-size:.82rem; font-weight:600;
    color:var(--error); background:none; border-radius:0; cursor:pointer; transition:background .1s;
    border-left:none; border-right:none; border-bottom:none;
  }
  .ep-dd-clear:hover { background:var(--error-light); }

  /* ── Responsive ── */
  @media (max-width:1024px) {
    .ep-acc-panel { width:300px; }
    .ep-explore-grid { grid-template-columns:repeat(3,1fr); }
  }
  @media (max-width:768px) {
    .ep-hero { height:auto; min-height:360px; }
    .ep-hero-inner { flex-direction:column; align-items:flex-start; justify-content:flex-end; padding-bottom:1.5rem; }
    .ep-acc-panel { width:100%; }
    .ep-grid { grid-template-columns:repeat(2,1fr); gap:1rem .75rem; }
    .ep-img-wrap { height:220px; }
    .ep-cta-inner { flex-direction:column; gap:1.5rem; }
    .ep-filter-spacer { display:none; }
  }
  @media (max-width:480px) {
    .ep-grid { grid-template-columns:1fr; }
    .ep-explore-grid { grid-template-columns:repeat(2,1fr); }
    .ep-hero-title { font-size:2.4rem; }
  }
`;
