import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AccessibilityBadge from "./AccessibilityBadge";
import { useAuth } from "./AuthContext";
import { CAT_COLORS, CAT_ACCENT, SLUG_TO_CAT } from "./constants/categories";
import { useEvents } from "./hooks/useEvents";
import "./EventsPage.css";
const CAT_HERO = {
  "Música":     "/img/heroes/heromusica.jpg",
  "Teatro":     "/img/heroes/heroteatro.jpg",
  "Exposición": "/img/heroes/heroexposicion.jpg",
  "Cine":       "/img/heroes/herocine.jpg",
  "Danza":      "/img/heroes/herodanza.jpg",
  "Cultura":    "/img/heroes/herocultura.jpg",
  "Todos":      "/img/heroes/herotodoseventos.jpg",
};

const CAT_HERO_POS = {
  "Cine":       "center top",
  "Todos":      "center 30%",
  "Exposición": "center 70%",
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
    <div className="ep-card reveal" onClick={() => onOpenDetail(ev)}
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

export default function EventsPage() {
  const { cat: catSlug } = useParams();
  const navigate          = useNavigate();
  const resolvedCat       = catSlug ? (SLUG_TO_CAT[catSlug] || "Todos") : "Todos";
  const [activeCategory, setActiveCategory] = useState(resolvedCat);
  const [searchQ,        setSearchQ]        = useState("");
  const [activeAccess,   setActiveAccess]   = useState(null);
  const [dateFilter,     setDateFilter]     = useState(null);  // null | "hoy" | "semana" | "finde" | "mes"
  const [priceFilter,    setPriceFilter]    = useState(null);  // null | "gratis" | "pago"
  const [page,           setPage]           = useState(1);
  const PAGE_SIZE = 24;

  useEffect(() => {
    setActiveCategory(resolvedCat);
    setSearchQ("");
    setActiveAccess(null);
    setDateFilter(null);
    setPriceFilter(null);
    setPage(1);
  }, [resolvedCat]);

  useEffect(() => { setPage(1); }, [activeCategory, searchQ, activeAccess, dateFilter, priceFilter]);

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
    filtered = filtered.filter(ev => ev.isFree === true);
  } else if (priceFilter === "pago") {
    filtered = filtered.filter(ev => ev.isFree === false);
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
        return s.getTime() === today.getTime();
      }
      if (dateFilter === "semana") {
        const limit = new Date(today); limit.setDate(today.getDate() + 7);
        return s >= today && s <= limit;
      }
      if (dateFilter === "finde") {
        const dow = today.getDay();
        const sat = new Date(today); sat.setDate(today.getDate() + (dow === 6 ? 0 : 6 - dow));
        const sun = new Date(sat); sun.setDate(sat.getDate() + 1);
        return s >= sat && s <= sun;
      }
      if (dateFilter === "mes") {
        return s.getMonth() === today.getMonth() && s.getFullYear() === today.getFullYear();
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
      <div className="ep-page">
        <Navbar/>

        {/* ── Hero ── */}
        <section className="ep-hero" style={{backgroundImage:`url(${CAT_HERO[activeCategory]||CAT_HERO["Todos"]})`, backgroundPosition: CAT_HERO_POS[activeCategory] || "center"}}>
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
          <div className="ep-grid">
            {loading
              ? Array.from({length:12}).map((_,i) => <SkeletonCard key={i}/>)
              : filtered.length === 0
                ? <p className="ep-empty">No hay eventos para esta selección.</p>
                : filtered.slice(0, page * PAGE_SIZE).map(ev => <GridCard key={ev.id} ev={ev} onOpenDetail={openDetail}/>)
            }
          </div>
          {!loading && filtered.length > page * PAGE_SIZE && (
            <div style={{textAlign:"center", marginTop:"2rem"}}>
              <button className="ep-load-more" onClick={() => setPage(p => p + 1)}>
                Cargar más ({filtered.length - page * PAGE_SIZE} restantes)
              </button>
            </div>
          )}
        </section>

      </div>
    </>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

