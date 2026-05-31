import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessibilityBadge from "./AccessibilityBadge";
import { useAuth } from "./AuthContext";
import { WheelIcon as WheelIconShared, HandsIcon, BucleIcon as BucleIconShared, PodoIcon as PodoIconShared } from "./AccessibilityIcons";
import { JUNE_EVENTS } from "./juneEvents";

// ─── Categorías y colores ─────────────────────────────────────────────────────
const CAT_COLORS = {
  "Música":     { bg: "#1A1A1A" },
  "Teatro":     { bg: "#141414" },
  "Exposición": { bg: "#111111" },
  "Cine":       { bg: "#1A1A1A" },
  "Danza":      { bg: "#141414" },
  "Cultura":    { bg: "#111111" },
};

const CATEGORIES = ["Música", "Teatro", "Exposición", "Cine", "Danza", "Cultura"];

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
const HeartIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill={filled ? "#e74c3c" : "none"} stroke={filled ? "#e74c3c" : "rgba(255,255,255,0.9)"}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// ─── Eventos fijos Junio 2026 (importados desde juneEvents.js) ───────────────
const _JUNE_EVENTS_UNUSED = [
  // Música
  { id:"m1", cat:"Música",     title:"Jazz en el Conde Duque",        dateShort:"5 JUN",       timeStr:"20:00 h", venue:"C.C. Conde Duque",        district:"Centro",    price:"Gratis", access:["silla","signos"], image:"/img/eventos/musica/Jazz%20en%20el%20Conde%20Duque.jpg", url:"#", descFull:"Una noche de jazz en vivo en el emblemático Centro Cultural Conde Duque. Artistas internacionales y nacionales se unen para ofrecer una experiencia musical única.", date:"5 de junio de 2026", venueRaw:"C.C. Conde Duque", org:"Área de Cultura Madrid" },
  { id:"m2", cat:"Música",     title:"Concierto Flamenco Accesible",  dateShort:"12 JUN",      timeStr:"21:00 h", venue:"Café de las Artes",        district:"Malasaña",  price:"10 €",   access:["silla"],          image:"/img/eventos/musica/Concierto%20Flamenco%20Accesible.jpg", url:"#", descFull:"Noche de flamenco auténtico con artistas del barrio en un espacio completamente accesible. La esencia del flamenco más puro en el corazón de Malasaña.", date:"12 de junio de 2026", venueRaw:"Café de las Artes", org:"" },
  { id:"m3", cat:"Música",     title:"Rock Inclusivo Madrid",         dateShort:"19 JUN",      timeStr:"20:30 h", venue:"WiZink Center",            district:"Goya",      price:"25 €",   access:["silla","bucle"],  image:"/img/eventos/musica/Rock%20Inclusivo%20Madrid.jpg", url:"#", descFull:"Festival de rock con intérpretes de lengua de signos en todas las actuaciones y acceso garantizado para personas con movilidad reducida.", date:"19 de junio de 2026", venueRaw:"WiZink Center", org:"Live Nation" },
  { id:"m4", cat:"Música",     title:"Orquesta Sinfónica Accesible",  dateShort:"26 JUN",      timeStr:"19:00 h", venue:"Auditorio Nacional",       district:"Salamanca", price:"Gratis", access:["silla","signos","bucle"], image:"/img/eventos/musica/Orquesta%20Sinf%C3%B3nica%20Accesible.jpeg", url:"#", descFull:"Concierto de la Orquesta Sinfónica de Madrid con bucle magnético, intérprete de lengua de signos y acceso completo para silla de ruedas.", date:"26 de junio de 2026", venueRaw:"Auditorio Nacional", org:"OCNE" },

  // Teatro
  { id:"t1", cat:"Teatro",     title:"La Casa de Bernarda Alba",      dateShort:"6–8 JUN",     timeStr:"19:30 h", venue:"Teatro Español",           district:"Centro",    price:"15 €",   access:["signos"],         image:"/img/eventos/teatro/La%20Casa%20de%20Bernarda%20Alba.jpg", url:"#", descFull:"La obra cumbre de Federico García Lorca en una producción contemporánea. Una mirada actual a la opresión, el deseo y la libertad en la España rural.", date:"6 al 8 de junio de 2026", venueRaw:"Teatro Español", org:"Teatro Español" },
  { id:"t2", cat:"Teatro",     title:"Don Quijote Accesible",         dateShort:"13 JUN",      timeStr:"18:00 h", venue:"Teatros del Canal",        district:"Chamberí",  price:"12 €",   access:["silla","signos"], image:"/img/eventos/teatro/Don%20Quijote%20Accesible.jpg", url:"#", descFull:"Adaptación accesible de Don Quijote con audiodescripción, intérprete de lengua de signos y plazas reservadas para silla de ruedas.", date:"13 de junio de 2026", venueRaw:"Teatros del Canal", org:"Teatros del Canal" },
  { id:"t3", cat:"Teatro",     title:"Bodas de Sangre",               dateShort:"20–21 JUN",   timeStr:"20:00 h", venue:"Teatro María Guerrero",    district:"Almagro",   price:"18 €",   access:["silla"],          image:"/img/eventos/teatro/Bodas%20de%20sangre.jpg", url:"#", descFull:"Nueva producción del Centro Dramático Nacional de Bodas de Sangre, con diseño de producción inclusivo y funciones con audiodescripción.", date:"20 al 21 de junio de 2026", venueRaw:"Teatro María Guerrero", org:"CDN" },
  { id:"t4", cat:"Teatro",     title:"El Gran Teatro del Mundo",      dateShort:"27 JUN",      timeStr:"20:00 h", venue:"Corral de Comedias",       district:"Centro",    price:"10 €",   access:["silla","bucle"],  image:"/img/eventos/teatro/El%20Gran%20Teatro%20del%20Mundo.jpeg", url:"#", descFull:"Auto sacramental de Calderón de la Barca en el histórico Corral de Comedias, con bucle magnético y acceso adaptado.", date:"27 de junio de 2026", venueRaw:"Corral de Comedias", org:"" },

  // Exposición
  { id:"e1", cat:"Exposición", title:"Picasso: Miradas Múltiples",    dateShort:"TODO JUN",    timeStr:"",        venue:"Museo Reina Sofía",        district:"Atocha",    price:"12 €",   access:["silla","bucle"],  image:"/img/eventos/exposicion/Picasso%20Miradas%20M%C3%BAltiples.jpg", url:"#", descFull:"Exposición temporal que reúne más de 150 obras del maestro malagueño, explorando las distintas etapas de su prolífica carrera artística.", date:"Junio 2026", venueRaw:"Museo Reina Sofía", org:"Museo Reina Sofía" },
  { id:"e2", cat:"Exposición", title:"Arte Urbano Madrid",            dateShort:"TODO JUN",    timeStr:"",        venue:"Matadero Madrid",          district:"Arganzuela", price:"Gratis", access:["silla"],          image:"/img/eventos/exposicion/Arte%20Urbano%20Madrid.jpg", url:"#", descFull:"Muestra de arte urbano de los artistas más relevantes de la escena madrileña. Graffiti, stencil y arte callejero en un espacio totalmente accesible.", date:"Junio 2026", venueRaw:"Matadero Madrid", org:"Matadero" },
  { id:"e3", cat:"Exposición", title:"Fotografía Inclusiva",          dateShort:"15–30 JUN",   timeStr:"",        venue:"Casa de América",          district:"Retiro",    price:"Gratis", access:["silla","signos"], image:"/img/eventos/exposicion/Fotograf%C3%ADa%20Inclusiva.jpg", url:"#", descFull:"Exposición de fotografía documental sobre diversidad funcional y vida independiente. Imágenes que redefinen la mirada sobre la discapacidad.", date:"15 al 30 de junio de 2026", venueRaw:"Casa de América", org:"" },
  { id:"e4", cat:"Exposición", title:"Carteles Históricos Madrid",    dateShort:"TODO JUN",    timeStr:"",        venue:"Círculo de Bellas Artes",  district:"Centro",    price:"Gratis", access:["silla"],          image:"/img/eventos/exposicion/Carteles%20Hist%C3%B3ricos%20Madrid.jpg", url:"#", descFull:"Colección de los carteles más icónicos de la historia de Madrid, desde el siglo XIX hasta la actualidad. Un recorrido visual por la identidad gráfica de la ciudad.", date:"Junio 2026", venueRaw:"Círculo de Bellas Artes", org:"Círculo de Bellas Artes" },

  // Cine
  { id:"c1", cat:"Cine",       title:"Ciclo Almodóvar Subtitulado",   dateShort:"3 JUN",       timeStr:"18:00 h", venue:"Filmoteca Española",       district:"Lavapiés",  price:"3 €",    access:["bucle"],          image:"/img/eventos/cine/Ciclo%20Almod%C3%B3var%20Subtitulado.jpg", url:"#", descFull:"Ciclo Almodóvar. Proyección de Todo sobre mi madre en versión original con subtítulos en español y bucle magnético.", date:"3 de junio de 2026", venueRaw:"Filmoteca Española", org:"Filmoteca Española" },
  { id:"c2", cat:"Cine",       title:"Festival Cine Accesible",       dateShort:"10–14 JUN",   timeStr:"",        venue:"Cines Verdi",              district:"Gracia",    price:"5 €",    access:["silla","signos","bucle"], image:"/img/eventos/cine/Festival%20Cine%20Accesible.jpg", url:"#", descFull:"Festival dedicado al cine con accesibilidad plena: subtítulos, audiodescripción, bucle magnético e intérprete de lengua de signos en todas las sesiones.", date:"10 al 14 de junio de 2026", venueRaw:"Cines Verdi", org:"" },
  { id:"c3", cat:"Cine",       title:"Cine con Audiodescripción",     dateShort:"17 JUN",      timeStr:"20:00 h", venue:"Cinesa Proyecciones",      district:"Centro",    price:"8 €",    access:["bucle","silla"],  image:"/img/eventos/cine/Cine%20con%20Audiodescripci%C3%B3n.jpg", url:"#", descFull:"Sesión especial con audiodescripción integrada para personas con discapacidad visual. Película sorpresa de la temporada.", date:"17 de junio de 2026", venueRaw:"Cinesa Proyecciones", org:"" },
  { id:"c4", cat:"Cine",       title:"Cine de Verano Accesible",      dateShort:"24 JUN",      timeStr:"22:00 h", venue:"Parque del Retiro",        district:"Retiro",    price:"Gratis", access:["silla"],          image:"/img/eventos/cine/Cine%20de%20Verano%20Accesible.jpg", url:"#", descFull:"Proyección al aire libre en el Parque del Retiro con plataforma elevada para silla de ruedas y bucle magnético portátil.", date:"24 de junio de 2026", venueRaw:"Parque del Retiro", org:"Área de Cultura" },

  // Danza
  { id:"d1", cat:"Danza",      title:"Noche de Danza Contemporánea",  dateShort:"7 JUN",       timeStr:"20:30 h", venue:"Teatro del Canal",         district:"Chamberí",  price:"18 €",   access:["silla","signos"], image:"/img/eventos/danza/Noche%20de%20Danza%20Contempor%C3%A1nea.jpg", url:"#", descFull:"Una velada de danza contemporánea con compañías emergentes del panorama nacional e internacional. El movimiento como lenguaje universal.", date:"7 de junio de 2026", venueRaw:"Teatro del Canal", org:"Teatro del Canal" },
  { id:"d2", cat:"Danza",      title:"Ballet Accesible Madrid",       dateShort:"14 JUN",      timeStr:"19:00 h", venue:"Teatro Real",              district:"Ópera",     price:"22 €",   access:["silla","bucle"],  image:"/img/eventos/danza/Ballet%20Accesible%20Madrid.jpg", url:"#", descFull:"Gala de ballet con bucle magnético y plazas adaptadas. Compañía Nacional de Danza en una noche especial dedicada a la inclusión.", date:"14 de junio de 2026", venueRaw:"Teatro Real", org:"Compañía Nacional de Danza" },
  { id:"d3", cat:"Danza",      title:"Danza Inclusiva en el Retiro",  dateShort:"21 JUN",      timeStr:"18:00 h", venue:"Parque del Retiro",        district:"Retiro",    price:"Gratis", access:["silla","signos"], image:"/img/eventos/danza/Danza%20Inclusiva%20en%20el%20Retiro.jpg", url:"#", descFull:"Espectáculo de danza inclusiva con bailarines con y sin discapacidad. Entrada libre en el Parque del Retiro.", date:"21 de junio de 2026", venueRaw:"Parque del Retiro", org:"" },
  { id:"d4", cat:"Danza",      title:"Flamenco Accesible Madrid",     dateShort:"28 JUN",      timeStr:"21:00 h", venue:"Villa Rosa",               district:"Centro",    price:"15 €",   access:["silla"],          image:"/img/eventos/danza/Flamenco%20Accesible%20Madrid.jpg", url:"#", descFull:"Tablao flamenco en el histórico Villa Rosa con acceso adaptado para sillas de ruedas y reserva de plazas especiales.", date:"28 de junio de 2026", venueRaw:"Villa Rosa", org:"" },

  // Cultura
  { id:"cu1", cat:"Cultura",   title:"Feria del Libro de Madrid",     dateShort:"1–14 JUN",    timeStr:"",        venue:"Parque del Retiro",        district:"Retiro",    price:"Gratis", access:["silla"],          image:"/img/eventos/cultura/Feria%20del%20Libro%20de%20Madrid.jpg", url:"#", descFull:"La cita anual más importante del sector editorial en España. Más de 350 casetas con libros de todos los géneros, firmas de autores y actividades para todas las edades.", date:"1 al 14 de junio de 2026", venueRaw:"Parque del Retiro", org:"Cámara del Libro" },
  { id:"cu2", cat:"Cultura",   title:"Visita Guiada Accesible Prado", dateShort:"11 JUN",      timeStr:"11:00 h", venue:"Museo del Prado",          district:"Retiro",    price:"Gratis", access:["silla","signos","bucle"], image:"/img/eventos/cultura/Visita%20Guiada%20Accesible%20Prado.jpg", url:"#", descFull:"Visita guiada en lengua de signos por las salas principales del Museo del Prado. Incluye bucle magnético y plazas para silla de ruedas.", date:"11 de junio de 2026", venueRaw:"Museo del Prado", org:"Museo del Prado" },
  { id:"cu3", cat:"Cultura",   title:"Taller Inclusivo de Arte",      dateShort:"18 JUN",      timeStr:"10:00 h", venue:"Matadero Madrid",          district:"Arganzuela", price:"Gratis", access:["silla","signos"], image:"/img/eventos/cultura/Taller%20Inclusivo%20de%20Arte.jpg", url:"#", descFull:"Taller de creación artística para personas con y sin discapacidad. Materiales adaptados y monitores especializados en arte inclusivo.", date:"18 de junio de 2026", venueRaw:"Matadero Madrid", org:"Matadero" },
  { id:"cu4", cat:"Cultura",   title:"Festival Cultura Accesible",    dateShort:"25–29 JUN",   timeStr:"",        venue:"CentroCentro",             district:"Retiro",    price:"Gratis", access:["silla","signos","bucle","podo"], image:"/img/eventos/cultura/Festival%20Cultura%20Accesible.jpg", url:"#", descFull:"Festival multidisciplinar con accesibilidad completa: música, teatro, danza y exposiciones. Todas las actividades con intérprete de lengua de signos.", date:"25 al 29 de junio de 2026", venueRaw:"CentroCentro", org:"Ayuntamiento de Madrid" },
];

const img = (p) => encodeURI(p);

function byCategory(cat) {
  return JUNE_EVENTS.filter(e => e.cat === cat);
}

// ─── Tarjeta de evento ────────────────────────────────────────────────────────
function EventCard({ ev, onOpenDetail }) {
  const colors = CAT_COLORS[ev.cat] || { bg: "#111111" };
  const [imgOk, setImgOk] = useState(!!ev.image);
  const { user, favIds, addFav, removeFav } = useAuth();
  const isFav = favIds.has(String(ev.id));

  return (
    <div
      className="eg-card"
      onClick={() => onOpenDetail(ev)}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalle de ${ev.title}`}
      onKeyDown={e => e.key === "Enter" && onOpenDetail(ev)}
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
        {user && (
          <button
            className={`eg-fav-btn${isFav ? " eg-fav-on" : ""}`}
            aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
            title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
            onClick={e => { e.stopPropagation(); isFav ? removeFav(ev.id) : addFav(ev); }}
          >
            <HeartIcon filled={isFav}/>
          </button>
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

const CAT_SLUG = {
  "Música":"musica","Teatro":"teatro","Exposición":"exposicion",
  "Cine":"cine","Danza":"danza","Cultura":"cultura",
};

const CAT_ACCENT = {
  "Música":     "#3D47C8",
  "Teatro":     "#7C3AED",
  "Exposición": "#0369A1",
  "Cine":       "#92400E",
  "Danza":      "#DB2777",
  "Cultura":    "#1A237E",
};

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
const css = `
  .eg-wrap {
    background: #FFFFFF;
    padding: clamp(2.5rem, 6vw, 5rem) 0 clamp(3rem, 7vw, 6rem);
    border-top: 1.5px solid #111111;
    width: 100%;
  }
  .eg-inner {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 clamp(1rem, 3vw, 2rem);
  }
  .eg-section-head {
    display: flex; align-items: flex-end; justify-content: space-between;
    border-bottom: 1.5px solid #111111; padding-bottom: 1.25rem; margin-bottom: 2.5rem;
  }
  .eg-section-label {
    font-size: .72rem; font-weight: 700; letter-spacing: .18em;
    text-transform: uppercase; color: var(--brand, #3D47C8); margin-bottom: .5rem;
    font-family: 'Inter', sans-serif; display: block;
  }
  .eg-section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 7vw, 7rem); letter-spacing: .02em; color: #111111; line-height: .9;
    margin: 0;
  }
  .eg-hl { color: var(--brand, #3D47C8); }

  .eg-row-section { margin-bottom: 3.5rem; }
  .eg-row-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.25rem; padding: 0 .25rem;
    border-bottom: 2px solid #f0f0f0; padding-bottom: .85rem;
  }
  .eg-row-label { display: flex; align-items: center; gap: .85rem; }
  .eg-row-title {
    font-family: 'Bebas Neue', sans-serif; font-weight: 400;
    font-size: 2rem; letter-spacing: .06em; margin: 0; line-height: 1;
  }
  .eg-row-count { font-size: .72rem; color: #999999; font-family: 'Inter', sans-serif; letter-spacing: .05em; margin-top: .2rem; }
  .eg-view-all {
    display: inline-flex; align-items: center; gap: .3rem;
    font-family: 'Inter', sans-serif; font-size: .72rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: #111111; background: none; border: none; border-bottom: 1.5px solid #111111;
    padding: .15rem 0; cursor: pointer; transition: opacity .15s; white-space: nowrap;
  }
  .eg-view-all:hover { opacity: .5; }
  .eg-view-all:focus-visible { outline: 2px solid #111827; outline-offset: 2px; }

  .eg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 280px);
    gap: 1.25rem;
    justify-content: center;
  }
  @media (max-width: 900px)  { .eg-grid { grid-template-columns: repeat(auto-fill, 230px); } }
  @media (max-width: 640px)  { .eg-grid { grid-template-columns: repeat(auto-fill, 185px); } }

  .eg-card {
    flex-shrink: 0; width: 280px; border: none; background: transparent;
    padding: 0; text-align: left; scroll-snap-align: start;
    display: flex; flex-direction: column; transition: transform .2s;
    cursor: pointer; border-radius: 0;
  }
  .eg-card:hover { transform: translateY(-5px); }
  .eg-card:focus-visible { outline: 2px solid #111827; outline-offset: 3px; border-radius: 2px; }

  .eg-img-wrap { position: relative; width: 100%; height: 380px; overflow: hidden; flex-shrink: 0; }
  .eg-img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; display: block; }
  .eg-card:hover .eg-img { transform: scale(1.04); }
  .eg-fav-btn {
    position: absolute; top: 8px; right: 8px;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(0,0,0,.45); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s, transform .15s;
    backdrop-filter: blur(4px);
  }
  .eg-fav-btn:hover { background: rgba(0,0,0,.7); transform: scale(1.1); }
  .eg-fav-on { background: rgba(231,76,60,.2)!important; }
  .eg-fav-on:hover { background: rgba(231,76,60,.35)!important; }
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
  .eg-access-chip { margin-bottom: 0; }

  .eg-skel {
    background: linear-gradient(90deg, #EBEBEB 25%, #F5F5F5 50%, #EBEBEB 75%);
    background-size: 200%; animation: egskel 1.4s infinite; border-radius: 2px; margin-bottom: .5rem;
  }
  @keyframes egskel { 0%{background-position:200% 0}100%{background-position:-200% 0} }

  @media (max-width: 900px) {
    .eg-section-head { flex-direction: column; align-items: flex-start; gap: .75rem; }
    .eg-card { width: 230px; }
    .eg-img-wrap { height: 310px; }
    .eg-row-title { font-size: 1.6rem; }
  }
  @media (max-width: 640px) {
    .eg-card { width: 185px; }
    .eg-img-wrap { height: 250px; }
    .eg-section-title { font-size: 1.75rem; }
    .eg-row-title { font-size: 1.35rem; }
  }
`;

// ─── Componente principal ─────────────────────────────────────────────────────
export default function EventsGrid({ onOpenDetail }) {
  return (
    <>
      <style>{css}</style>
      <section className="eg-wrap">
        <div className="eg-inner">

          <div className="eg-section-head">
            <div>
              <h2 className="eg-section-title">EVENTOS<br/><span className="eg-hl">EN MADRID</span></h2>
            </div>
          </div>

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
