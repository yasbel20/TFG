import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MADRID_EVENTS_URL } from "../../constants/api";
import { parseEvent } from "../../utils/parsing";

const DIAS_AG = ["DOM","LUN","MAR","MIÉ","JUE","VIE","SÁB"];

function toKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function parseDateKeyAg(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m-1, d);
}

function makeSampleAg() {
  const base = new Date(); base.setHours(0,0,0,0);
  const mk = (offset, h, m2, title, cat, venue, timeStr) => {
    const d = new Date(base); d.setDate(d.getDate()+offset); d.setHours(h,m2,0,0);
    return { id:`s${offset}${h}`, title, cat, dateKey:toKey(d), timeStr, access:["silla"], venue, image:null, url:"#", descFull:"", price:"Gratis" };
  };
  return [
    mk(0, 20, 0,  "Jazz en el Conde Duque",          "Música",     "C.C. Conde Duque",      "20:00h"),
    mk(0, 19, 30, "La Casa de Bernarda Alba",          "Teatro",     "Teatro Español",         "19:30h"),
    mk(0, 21, 0,  "Concierto Flamenco Accesible",      "Música",     "Café de las Artes",      "21:00h"),
    mk(1, 10, 0,  "Picasso: Miradas múltiples",        "Exposición", "Museo Reina Sofía",      "10:00h"),
    mk(1, 18, 0,  "Cine: Todo sobre mi madre",         "Cine",       "Filmoteca Española",     "18:00h"),
    mk(1, 20, 30, "Noche de Danza Contemporánea",      "Danza",      "Teatro del Canal",       "20:30h"),
    mk(2, 10, 0,  "Feria del Libro de Madrid",         "Cultura",    "Parque del Retiro",      "10:00h"),
  ];
}

export default function AgendaDestacada() {
  const navigate = useNavigate();
  const [events, setEvents]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selKey, setSelKey]         = useState(() => toKey(new Date()));

  useEffect(() => {
    fetch(MADRID_EVENTS_URL)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const parsed = (data["@graph"]||[]).map(parseEvent).filter(e => e.dateKey !== "sin-fecha" && e.access.length > 0);
        setEvents(parsed.length ? parsed : makeSampleAg());
      })
      .catch(() => setEvents(makeSampleAg()))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date(); today.setHours(0,0,0,0);
  const strip = Array.from({length:7}, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + weekOffset*7 - 3 + i);
    return { key:toKey(d), dia:DIAS_AG[d.getDay()], num:d.getDate(), isToday:d.toDateString()===today.toDateString() };
  });

  const goWeek = (dir) => {
    const newOffset = weekOffset + dir;
    setWeekOffset(newOffset);
    const d = new Date(today); d.setDate(today.getDate() + newOffset*7);
    setSelKey(toKey(d));
  };

  const dayEvs = events.filter(e => e.dateKey === selKey).slice(0, 4);
  const selDate = parseDateKeyAg(selKey);
  const selLabel = selDate.toLocaleDateString("es-ES", {weekday:"long", day:"numeric", month:"long", year:"numeric"});

  return (
    <section className="ad-sec reveal" aria-labelledby="ad-title">
      <div className="ad-inner">
        <div className="ad-left">
          <p className="sec-eyebrow">En Madrid hoy</p>
          <h2 id="ad-title" className="ad-heading">
            AGENDA<br/><span className="ad-hl">DESTACADA</span>
          </h2>
        </div>

        <div className="ad-right">
          <div className="ad-strip-wrap">
            <button className="ad-nav-btn" onClick={() => goWeek(-1)} aria-label="Semana anterior">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="ad-strip" role="tablist" aria-label="Seleccionar día">
              {strip.map(d => (
                <button
                  key={d.key}
                  role="tab"
                  aria-selected={d.key === selKey}
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

          <div className="ad-list" role="list">
            {loading ? [1,2,3].map(i => (
              <div key={i} className="ad-skel" aria-hidden="true"/>
            )) : dayEvs.length === 0 ? (
              <p className="ad-empty">No hay eventos accesibles registrados para este día.</p>
            ) : dayEvs.map(ev => (
              <article
                key={ev.id} className="ad-row" role="listitem"
                onClick={() => navigate(`/evento/${ev.id}`, {state:{ev}})}
                tabIndex={0} onKeyDown={e => (e.key==="Enter" || e.key===" ") && navigate(`/evento/${ev.id}`, {state:{ev}})}
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
            <button className="ad-more-btn" onClick={() => navigate("/agenda")}>
              Ver agenda completa
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" style={{marginLeft:"6px"}}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
