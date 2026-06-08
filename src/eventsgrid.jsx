import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessibilityBadge from "./AccessibilityBadge";
import { WheelIcon as WheelIconShared, HandsIcon, BucleIcon as BucleIconShared, PodoIcon as PodoIconShared } from "./AccessibilityIcons";
import { JUNE_EVENTS } from "./juneEvents";
import { CAT_COLORS, CAT_ACCENT, CAT_SLUG, CATEGORIES } from "./constants/categories";
import { getFallbackImage } from "./utils/fallbackImages";
import "./EventsGrid.css";

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
const WheelIcon  = (p) => <WheelIconShared  size={11} {...p}/>;
const SignosIcon = (p) => <HandsIcon        size={11} {...p}/>;
const BucleIcon  = (p) => <BucleIconShared  size={11} {...p}/>;
const PodoIcon   = (p) => <PodoIconShared   size={11} {...p}/>;
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

function byCategory(cat) {
  return JUNE_EVENTS.filter(e => e.cat === cat);
}

// ─── Tarjeta de evento ────────────────────────────────────────────────────────
function EventCard({ ev, onOpenDetail }) {
  const catColor = CAT_COLORS[ev.cat] || "#111111";
  const local = getFallbackImage(ev.cat, ev.id);
  const [imgSrc, setImgSrc] = useState(ev.image || local);
  const [imgOk, setImgOk] = useState(true);

  const handleError = () => {
    if (imgSrc !== local) {
      setImgSrc(local);
    } else {
      setImgOk(false);
    }
  };

  return (
    <div
      className="eg-card reveal"
      onClick={() => onOpenDetail(ev)}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalle de ${ev.title}`}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onOpenDetail(ev)}
    >
      <div className="eg-img-wrap">
        {imgOk ? (
          <img
            src={imgSrc}
            alt={ev.title}
            className="eg-img"
            onError={handleError}
            loading="lazy"
          />
        ) : (
          <div className="eg-img-fallback" style={{ background: catColor }}>
            <div className="eg-fallback-pattern"/>
          </div>
        )}
      </div>

      <div className="eg-info">
        <span className="eg-cat">{ev.cat}</span>
        <h3 className="eg-title" style={{ color: CAT_ACCENT[ev.cat] || "#111111" }}>{ev.title}</h3>
        {ev.access.length > 0 && (
          <AccessibilityBadge types={ev.access} className="eg-access-chip"
            style={{color:"#6b7280"}}/>
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
    </div>
  );
}


// ─── Sección por categoría ────────────────────────────────────────────────────
function EventRow({ cat, events, onOpenDetail }) {
  const navigate = useNavigate();
  if (events.length === 0) return null;
  return (
    <div className="eg-row-section">
      <div className="eg-row-header">
        <div className="eg-row-label">
          <h2 className="eg-row-title" style={{ color: CAT_ACCENT[cat] || "#111" }}>{cat}</h2>
          <span className="eg-row-count">{events.length} eventos</span>
        </div>
        <button className="eg-view-all" onClick={() => navigate(`/eventos/${CAT_SLUG[cat] || ""}`)}>
          Ver todos <ChevronRightIcon/>
        </button>
      </div>
      <div className="eg-grid">
        {events.map(ev => (
          <EventCard key={ev.id} ev={ev} onOpenDetail={onOpenDetail}/>
        ))}
      </div>
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

// ─── Componente principal ─────────────────────────────────────────────────────
export default function EventsGrid({ onOpenDetail }) {

  return (
    <>
      <section className="eg-wrap">
        <div className="eg-inner">

          {CATEGORIES.map(cat => (
            <EventRow
              key={cat}
              cat={cat}
              events={byCategory(cat)}
              onOpenDetail={onOpenDetail}
            />
          ))}

        </div>
      </section>
    </>
  );
}
