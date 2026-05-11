import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar";

const ACCESIBILIDAD_LABELS = {
  silla:  "Silla de ruedas",
  signos: "Lengua de signos",
  podo:   "Podotáctil",
  bucle:  "Bucle magnético",
};

const CAT_COLORS = {
  "Música":     "#3D47C8",
  "Teatro":     "#7B1FA2",
  "Exposición": "#00695C",
  "Cine":       "#BF360C",
  "Danza":      "#AD1457",
  "Cultura":    "#1A237E",
};

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

export default function PerfilPage() {
  const { user, authFetch, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loadingRec,      setLoadingRec]      = useState(true);
  const [editando,        setEditando]         = useState(false);
  const [categorias,      setCategorias]       = useState(user?.categorias_favoritas ?? []);
  const [accesib,         setAccesib]          = useState(user?.accesibilidad_preferida ?? []);
  const [guardando,       setGuardando]        = useState(false);

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    authFetch("/recomendaciones")
      .then(r => r.json())
      .then(data => { setRecomendaciones(Array.isArray(data) ? data : []); })
      .catch(() => setRecomendaciones([]))
      .finally(() => setLoadingRec(false));
  }, [user]);

  const toggleCat = cat =>
    setCategorias(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const toggleAcc = key =>
    setAccesib(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const guardarPreferencias = async () => {
    setGuardando(true);
    try {
      const res  = await authFetch("/perfil/preferencias", {
        method: "PUT",
        body: JSON.stringify({ categorias_favoritas: categorias, accesibilidad_preferida: accesib }),
      });
      const data = await res.json();
      setUser(data);
      setEditando(false);
      setLoadingRec(true);
      authFetch("/recomendaciones")
        .then(r => r.json())
        .then(d => setRecomendaciones(Array.isArray(d) ? d : []))
        .finally(() => setLoadingRec(false));
    } finally {
      setGuardando(false);
    }
  };

  if (!user) return null;

  const inicial = user.name.charAt(0).toUpperCase();
  const tienePreferencias = (user.categorias_favoritas?.length > 0) || (user.accesibilidad_preferida?.length > 0);

  return (
    <>
      <Navbar />
      <main id="main-content" className="pf-main">

        {/* ── Cabecera de perfil ── */}
        <section className="pf-hero">
          <div className="pf-avatar">{inicial}</div>
          <div className="pf-info">
            <h1 className="pf-name">{user.name}</h1>
            <p className="pf-email">{user.email}</p>
            {user.accesibilidad_preferida?.length > 0 && (
              <div className="pf-badges">
                {user.accesibilidad_preferida.map(key => (
                  <span key={key} className="pf-badge">{ACCESIBILIDAD_LABELS[key]}</span>
                ))}
              </div>
            )}
          </div>
          <div className="pf-hero-actions">
            <button className="pf-btn-edit" onClick={() => setEditando(e => !e)}>
              {editando ? "Cancelar" : "Editar preferencias"}
            </button>
            <button className="pf-btn-logout" onClick={() => { logout(); navigate("/"); }}>
              Cerrar sesión
            </button>
          </div>
        </section>

        {/* ── Panel de edición ── */}
        {editando && (
          <section className="pf-edit">
            <h2 className="pf-section-title">Editar preferencias</h2>
            <div className="pf-edit-group">
              <p className="pf-edit-label">Tipos de evento</p>
              <div className="pf-chips">
                {["Música","Teatro","Exposición","Cine","Danza","Cultura"].map(cat => (
                  <button key={cat}
                    className={`pf-chip${categorias.includes(cat) ? " pf-chip--on" : ""}`}
                    onClick={() => toggleCat(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="pf-edit-group">
              <p className="pf-edit-label">Accesibilidad</p>
              <div className="pf-chips">
                {Object.entries(ACCESIBILIDAD_LABELS).map(([key, label]) => (
                  <button key={key}
                    className={`pf-chip${accesib.includes(key) ? " pf-chip--on" : ""}`}
                    onClick={() => toggleAcc(key)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button className="pf-btn-save" onClick={guardarPreferencias} disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
          </section>
        )}

        {/* ── Eventos recomendados ── */}
        <section className="pf-recs">
          <h2 className="pf-section-title">
            {tienePreferencias ? "Eventos recomendados para ti" : "Eventos destacados"}
          </h2>

          {!tienePreferencias && (
            <p className="pf-recs-hint">
              Completa tus preferencias para ver eventos personalizados.{" "}
              <button className="pf-recs-link" onClick={() => setEditando(true)}>
                Configurar ahora
              </button>
            </p>
          )}

          {loadingRec ? (
            <p className="pf-loading">Cargando recomendaciones…</p>
          ) : recomendaciones.length === 0 ? (
            <p className="pf-empty">No hay eventos disponibles con tus preferencias actuales.</p>
          ) : (
            <div className="pf-grid">
              {recomendaciones.map(ev => (
                <article key={ev.id} className="pf-card"
                  onClick={() => navigate(`/evento/${ev.id}`, { state: { ev } })}
                  role="button" tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && navigate(`/evento/${ev.id}`, { state: { ev } })}>
                  <div className="pf-card-cat" style={{ background: CAT_COLORS[ev.cat] ?? "#111" }}>
                    {ev.cat}
                  </div>
                  <div className="pf-card-body">
                    <h3 className="pf-card-title">{ev.title}</h3>
                    <p className="pf-card-meta">
                      <CalIcon /> {ev.dateShort}
                      {ev.timeStr && <> · {ev.timeStr}</>}
                    </p>
                    <p className="pf-card-meta">
                      <PinIcon /> {ev.venue}
                    </p>
                    <p className="pf-card-price">{ev.price}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>
      <style>{css}</style>
    </>
  );
}

const css = `
  .pf-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem clamp(1.25rem, 5vw, 3rem) 4rem;
    font-family: 'Inter', sans-serif;
  }

  /* ── Hero ── */
  .pf-hero {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding-bottom: 2rem;
    border-bottom: 1.5px solid #e5e5e5;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  .pf-avatar {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: #111; color: #fff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pf-info { flex: 1; min-width: 0; }
  .pf-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem; letter-spacing: .04em;
    color: #111; margin: 0 0 .2rem;
  }
  .pf-email { font-size: .83rem; color: #888; margin: 0 0 .75rem; }
  .pf-badges { display: flex; flex-wrap: wrap; gap: .4rem; }
  .pf-badge {
    font-size: .7rem; font-weight: 700; letter-spacing: .07em;
    text-transform: uppercase; color: #fff; background: #111;
    padding: .3rem .7rem;
  }
  .pf-hero-actions {
    display: flex; flex-direction: column; gap: .5rem; align-items: flex-end;
  }
  .pf-btn-edit {
    background: none; border: 1.5px solid #111; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .75rem;
    font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    padding: .5rem 1rem; min-height: 40px; transition: all .15s; white-space: nowrap;
  }
  .pf-btn-edit:hover { background: #111; color: #fff; }
  .pf-btn-logout {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .75rem;
    color: #c0392b; text-decoration: underline; padding: 0;
  }

  /* ── Edición ── */
  .pf-edit {
    background: #f9f9f9;
    border: 1.5px solid #e5e5e5;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  .pf-section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem; letter-spacing: .04em;
    color: #111; margin: 0 0 1.25rem;
  }
  .pf-edit-group { margin-bottom: 1.25rem; }
  .pf-edit-label {
    font-size: .73rem; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: #555; margin: 0 0 .6rem;
  }
  .pf-chips { display: flex; flex-wrap: wrap; gap: .5rem; }
  .pf-chip {
    font-family: 'Inter', sans-serif; font-size: .75rem; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    border: 1.5px solid #ccc; background: transparent; color: #666;
    padding: .45rem .9rem; cursor: pointer;
    transition: all .15s; min-height: 36px;
  }
  .pf-chip:hover { border-color: #111; color: #111; }
  .pf-chip--on { border-color: #111; background: #111; color: #fff; }
  .pf-btn-save {
    background: #111; color: #fff; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .75rem;
    font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    padding: .7rem 1.5rem; min-height: 40px; transition: background .15s;
    margin-top: .5rem;
  }
  .pf-btn-save:hover:not(:disabled) { background: #333; }
  .pf-btn-save:disabled { opacity: .5; cursor: default; }

  /* ── Recomendaciones ── */
  .pf-recs-hint {
    font-size: .85rem; color: #777; margin: -.5rem 0 1.5rem;
  }
  .pf-recs-link {
    background: none; border: none; cursor: pointer;
    color: #111; font-weight: 700; text-decoration: underline;
    font-size: inherit; padding: 0;
  }
  .pf-loading, .pf-empty {
    font-size: .85rem; color: #999; padding: 2rem 0;
  }
  .pf-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
  }
  .pf-card {
    border: 1.5px solid #e5e5e5;
    cursor: pointer;
    transition: border-color .15s, transform .15s;
    overflow: hidden;
  }
  .pf-card:hover { border-color: #111; transform: translateY(-2px); }
  .pf-card-cat {
    font-family: 'Inter', sans-serif; font-size: .65rem;
    font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: #fff; padding: .4rem .75rem;
  }
  .pf-card-body { padding: .85rem; }
  .pf-card-title {
    font-family: 'Inter', sans-serif; font-size: .88rem; font-weight: 700;
    color: #111; margin: 0 0 .6rem; line-height: 1.35;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .pf-card-meta {
    display: flex; align-items: center; gap: .3rem;
    font-size: .73rem; color: #777; margin: .2rem 0;
  }
  .pf-card-price {
    font-size: .75rem; font-weight: 700; color: #111;
    margin: .5rem 0 0;
  }
`;
