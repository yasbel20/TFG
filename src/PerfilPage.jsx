import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar";
import AccessibilityBadge from "./AccessibilityBadge";
import OnboardingModal from "./OnboardingModal";

/* ── Constantes ── */
const ACCESIBILIDAD_LABELS = {
  silla:  "Silla de ruedas",
  signos: "Lengua de signos",
  podo:   "Podotáctil",
  bucle:  "Bucle magnético",
};

const ACCESIBILIDAD_ICONS = {
  silla:  "♿",
  signos: "🤟",
  podo:   "👣",
  bucle:  "🔊",
};

const CAT_COLORS = {
  "Música":     "#3D47C8",
  "Teatro":     "#7B1FA2",
  "Exposición": "#00695C",
  "Cine":       "#BF360C",
  "Danza":      "#AD1457",
  "Cultura":    "#1A237E",
};

const CAT_IMAGES = {
  "Música":     "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=260&fit=crop&q=80",
  "Teatro":     "https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&h=260&fit=crop&q=80",
  "Exposición": "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=500&h=260&fit=crop&q=80",
  "Cine":       "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=260&fit=crop&q=80",
  "Danza":      "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=500&h=260&fit=crop&q=80",
  "Cultura":    "https://images.unsplash.com/photo-1555993539-1732b0258235?w=500&h=260&fit=crop&q=80",
};

/* ── Iconos ── */
const PencilIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

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

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const HeartFilledIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const MailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
  </svg>
);


const MemberIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);

const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#3D47C8" aria-hidden="true">
    <path d="M12 2l2.4 4.8 5.6.8-4 3.9.9 5.5L12 14.4l-4.9 2.6.9-5.5-4-3.9 5.6-.8z"/>
    <polyline points="9 12 11 14 15 10" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ── Componente principal ── */
export default function PerfilPage() {
  const { user, authFetch, logout, setUser, favs, favIds, removeFav } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showOnboarding, setShowOnboarding] = useState(location.state?.onboarding === true);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loadingRec,      setLoadingRec]      = useState(true);
  const [errorRec,        setErrorRec]        = useState(false);
  const [editando,        setEditando]        = useState(false);
  const [categorias,      setCategorias]      = useState(user?.categorias_favoritas ?? []);
  const [accesib,         setAccesib]         = useState(user?.accesibilidad_preferida ?? []);
  const [guardando,       setGuardando]       = useState(false);
  const [mostrarTodas,    setMostrarTodas]    = useState(false);

  // Edición de datos personales
  const [editNombre,   setEditNombre]   = useState(false);
  const [tmpNombre,    setTmpNombre]    = useState(user?.name ?? "");
  const [savingInfo,   setSavingInfo]   = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    cargarRecomendaciones();
  }, [user?.email]);


  const guardarInfo = async (campos) => {
    setSavingInfo(true);
    try {
      const res  = await authFetch("/perfil", { method: "PUT", body: JSON.stringify(campos) });
      const data = await res.json();
      if (res.ok && data?.name) setUser(data);
    } finally {
      setSavingInfo(false);
    }
  };

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 300;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      guardarInfo({ avatar: canvas.toDataURL("image/jpeg", 0.6) });
    };
    img.src = url;
  };

  const cargarRecomendaciones = async () => {
    setLoadingRec(true);
    setErrorRec(false);
    try {
      const res  = await authFetch("/recomendaciones");
      const data = await res.json();
      setRecomendaciones(Array.isArray(data) ? data : []);
    } catch {
      setErrorRec(true);
      setRecomendaciones([]);
    } finally {
      setLoadingRec(false);
    }
  };

  const toggleCat = cat =>
    setCategorias(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const toggleAcc = key =>
    setAccesib(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );

  const guardarPreferencias = async () => {
    setGuardando(true);
    try {
      const res  = await authFetch("/perfil/preferencias", {
        method: "PUT",
        body: JSON.stringify({
          categorias_favoritas:    categorias,
          accesibilidad_preferida: accesib,
        }),
      });
      const data = await res.json();
      setUser(data);
      setEditando(false);
      await cargarRecomendaciones();
    } finally {
      setGuardando(false);
    }
  };

  if (!user) return null;
  if (showOnboarding) return <OnboardingModal onClose={() => setShowOnboarding(false)} />;

  const inicial = user.name.charAt(0).toUpperCase();
  const tienePreferencias =
    (user.categorias_favoritas?.length > 0) ||
    (user.accesibilidad_preferida?.length > 0);

  const accBadges = user.accesibilidad_preferida ?? [];
  const visibles  = mostrarTodas ? accBadges : accBadges.slice(0, 3);
  const mesRegistro = new Date(user.created_at || Date.now())
    .toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  return (
    <>
      <Navbar />
      <main id="main-content" className="pf-main">

        {/* ── Cabecera ── */}
        <section className="pf-hero">

          {/* Avatar */}
          <div className="pf-avatar-wrap">
            {user.avatar
              ? <img src={user.avatar} alt="Foto de perfil" className="pf-avatar-img" />
              : <div className="pf-avatar">{inicial}</div>
            }
            <button
              className="pf-avatar-edit"
              aria-label="Cambiar foto"
              onClick={() => fileInputRef.current?.click()}
              title="Cambiar foto"
            >
              <PencilIcon />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFoto}
            />
          </div>

          {/* Info vertical */}
          <div className="pf-info">

            {/* Nombre editable */}
            {editNombre ? (
              <div className="pf-inline-edit">
                <input
                  className="pf-inline-input"
                  value={tmpNombre}
                  onChange={e => setTmpNombre(e.target.value)}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === "Enter") { guardarInfo({ name: tmpNombre }); setEditNombre(false); }
                    if (e.key === "Escape") setEditNombre(false);
                  }}
                />
                <button className="pf-inline-save" disabled={savingInfo}
                  onClick={() => { guardarInfo({ name: tmpNombre }); setEditNombre(false); }}>
                  {savingInfo ? "…" : "✓"}
                </button>
                <button className="pf-inline-cancel" onClick={() => setEditNombre(false)}>✕</button>
              </div>
            ) : (
              <div className="pf-name-row">
                <h1 className="pf-name">{user.name}</h1>
                <button className="pf-inline-btn" onClick={() => { setTmpNombre(user.name); setEditNombre(true); }} title="Editar nombre">
                  <PencilIcon />
                </button>
              </div>
            )}

            {/* Email, Ciudad, Miembro — verticales */}
            <div className="pf-meta-list">
              <span className="pf-meta-item">
                <MailIcon /> {user.email}
              </span>


              <span className="pf-meta-item">
                <MemberIcon /> Miembro desde {mesRegistro}
              </span>
            </div>

            {accBadges.length > 0 && (
              <div className="pf-badges">
                {visibles.map(key => (
                  <span key={key} className="pf-badge">
                    <span aria-hidden="true">{ACCESIBILIDAD_ICONS[key]}</span>
                    {ACCESIBILIDAD_LABELS[key]}
                  </span>
                ))}
                {accBadges.length > 3 && (
                  <button className="pf-badge-more" onClick={() => setMostrarTodas(v => !v)}>
                    {mostrarTodas ? "Ver menos" : "Ver todas ▾"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="pf-hero-actions">
            <button className="pf-btn-edit" onClick={() => setEditando(e => !e)}>
              <PencilIcon />
              {editando ? "Cancelar" : "Editar preferencias"}
            </button>
            <button className="pf-btn-logout" onClick={() => { logout(); navigate("/"); }}>
              <LogoutIcon /> Cerrar sesión
            </button>
          </div>
        </section>

        {/* ── Estadísticas ── */}
        <section className="pf-stats" aria-label="Estadísticas de perfil">
          <div className="pf-stat">
            <span className="pf-stat-num">{favs.length}</span>
            <span className="pf-stat-label">Favoritos</span>
          </div>
          <div className="pf-stat-divider" aria-hidden="true"/>
          <div className="pf-stat">
            <span className="pf-stat-num">{user.categorias_favoritas?.length ?? 0}</span>
            <span className="pf-stat-label">Categorías</span>
          </div>
          <div className="pf-stat-divider" aria-hidden="true"/>
          <div className="pf-stat">
            <span className="pf-stat-num">{user.accesibilidad_preferida?.length ?? 0}</span>
            <span className="pf-stat-label">Accesibilidad</span>
          </div>
        </section>

        {/* ── Panel de edición ── */}
        {editando && (
          <section className="pf-edit">
            <h2 className="pf-section-title">Editar preferencias</h2>
            <div className="pf-edit-row">
              <div className="pf-edit-group">
                <p className="pf-edit-label">Tipos de evento</p>
                <div className="pf-chips">
                  {["Música","Teatro","Exposición","Cine","Danza","Cultura"].map(cat => {
                    const active = categorias.includes(cat);
                    return (
                      <button key={cat} className={`pf-chip${active ? " pf-chip--on" : ""}`} onClick={() => toggleCat(cat)}>
                        {active && <span className="pf-chip-check">✓</span>}
                        {cat}
                        {active && <span className="pf-chip-remove">✕</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="pf-edit-group">
                <p className="pf-edit-label">Accesibilidad</p>
                <div className="pf-chips">
                  {Object.entries(ACCESIBILIDAD_LABELS).map(([key, label]) => {
                    const active = accesib.includes(key);
                    return (
                      <button key={key} className={`pf-chip${active ? " pf-chip--on" : ""}`} onClick={() => toggleAcc(key)}>
                        {active && <span className="pf-chip-check">✓</span>}
                        {label}
                        {active && <span className="pf-chip-remove">✕</span>}
                      </button>
                    );
                  })}
                </div>
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

          {tienePreferencias ? (
            <p className="pf-recs-subtitle">Hemos encontrado estos eventos basados en tus preferencias e intereses.</p>
          ) : (
            <p className="pf-recs-hint">
              Completa tus preferencias para ver eventos personalizados.{" "}
              <button className="pf-recs-link" onClick={() => setEditando(true)}>Configurar ahora</button>
            </p>
          )}

          {loadingRec ? (
            <div className="pf-loading">
              <span className="pf-spinner" aria-hidden="true" />
              <span>Cargando eventos recomendados…</span>
            </div>
          ) : errorRec ? (
            <div className="pf-error">
              <p>No se pudieron cargar las recomendaciones.</p>
              <button className="pf-retry" onClick={() => cargarRecomendaciones()}>
                Reintentar
              </button>
            </div>
          ) : recomendaciones.length === 0 ? (
            <p className="pf-empty">No hay eventos disponibles con tus preferencias actuales.</p>
          ) : (
            <div className="pf-grid">
              {recomendaciones.map(ev => (
                <article
                  key={ev.id}
                  className="pf-card"
                  onClick={() => navigate(`/evento/${ev.id}`, { state: { ev: ev } })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && navigate(`/evento/${ev.id}`, { state: { ev: ev } })}
                >
                  <div className="pf-card-cat" style={{ background: CAT_COLORS[ev.cat] ?? "#111" }}>{ev.cat}</div>
                  <div className="pf-card-img-wrap">
                    <img className="pf-card-img" src={CAT_IMAGES[ev.cat] ?? CAT_IMAGES["Cultura"]} alt="" loading="lazy" />
                  </div>
                  <div className="pf-card-body">
                    <h3 className="pf-card-title">{ev.title}</h3>
                    <p className="pf-card-meta"><CalIcon /> {ev.dateShort}{ev.timeStr && <> · {ev.timeStr}</>}</p>
                    <p className="pf-card-meta"><PinIcon /> {ev.venue}</p>
                    <p className="pf-card-price">{ev.price}</p>
                    <span className="pf-card-link">Ver detalles <ArrowIcon /></span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── Mis favoritos ── */}
        <section className="pf-recs pf-favs-section">
          <h2 className="pf-section-title">
            <HeartFilledIcon /> Mis favoritos
          </h2>

          {favs.length === 0 ? (
            <p className="pf-empty">
              Aún no has guardado ningún evento.{" "}
              <button className="pf-recs-link" onClick={() => navigate("/eventos")}>
                Explorar eventos
              </button>
            </p>
          ) : (
            <div className="pf-grid">
              {favs.map(ev => (
                <article
                  key={ev.id}
                  className="pf-card pf-card--fav"
                  onClick={() => navigate(`/evento/${ev.id}`, { state: { ev } })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && navigate(`/evento/${ev.id}`, { state: { ev } })}
                >
                  <div className="pf-card-cat" style={{ background: CAT_COLORS[ev.cat] ?? "#111" }}>{ev.cat}</div>
                  <div className="pf-card-img-wrap">
                    <img className="pf-card-img" src={CAT_IMAGES[ev.cat] ?? CAT_IMAGES["Cultura"]} alt="" loading="lazy" />
                  </div>
                  <div className="pf-card-body">
                    <h3 className="pf-card-title">{ev.title}</h3>
                    <p className="pf-card-meta"><CalIcon /> {ev.dateShort ?? ev.date}{(ev.timeStr) && <> · {ev.timeStr}</>}</p>
                    <p className="pf-card-meta"><PinIcon /> {ev.venueRaw ?? ev.venue}</p>
                    <p className="pf-card-price">{ev.price}</p>
                    <div className="pf-card-footer">
                      <span className="pf-card-link">Ver detalles <ArrowIcon /></span>
                      <button
                        className="pf-card-remove"
                        aria-label="Quitar de favoritos"
                        title="Quitar de favoritos"
                        onClick={e => { e.stopPropagation(); removeFav(ev.id); }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
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

/* ── Estilos ── */
const css = `
  .pf-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem clamp(1.25rem, 5vw, 3rem) 4rem;
    font-family: 'Inter', sans-serif;
  }

  /* Hero */
  .pf-hero {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding-bottom: 2rem;
    border-bottom: 1.5px solid #e5e5e5;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  /* Avatar */
  .pf-avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }
  .pf-avatar, .pf-avatar-img {
    width: 90px; height: 90px;
    border-radius: 50%;
    border: 3px solid #e5e5e5;
    display: flex; align-items: center; justify-content: center;
  }
  .pf-avatar {
    background: #111; color: #fff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.4rem;
  }
  .pf-avatar-img { object-fit: cover; }
  .pf-avatar-edit {
    position: absolute; bottom: 2px; right: 2px;
    width: 28px; height: 28px; border-radius: 50%;
    background: #fff; border: 1.5px solid #ccc;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #555; transition: background .15s;
    box-shadow: 0 1px 4px rgba(0,0,0,.12);
  }
  .pf-avatar-edit:hover { background: #111; color: #fff; border-color: #111; }

  /* Edición inline */
  .pf-inline-edit {
    display: flex; align-items: center; gap: .35rem; flex-wrap: nowrap;
  }
  .pf-inline-edit--sm { display: inline-flex; }
  .pf-inline-input {
    border: 1.5px solid #111; padding: .3rem .6rem;
    font-family: 'Inter', sans-serif; font-size: .9rem;
    outline: none; min-width: 0; flex: 1;
  }
  .pf-inline-save {
    background: #111; color: #fff; border: none; cursor: pointer;
    font-size: .8rem; font-weight: 700; padding: .3rem .55rem;
    transition: background .15s;
  }
  .pf-inline-save:disabled { opacity: .5; }
  .pf-inline-cancel {
    background: none; border: 1.5px solid #ccc; cursor: pointer;
    font-size: .8rem; color: #666; padding: .3rem .5rem;
  }
  .pf-inline-btn {
    background: none; border: none; cursor: pointer; color: #bbb;
    padding: .2rem; display: inline-flex; align-items: center;
    transition: color .15s;
  }
  .pf-inline-btn:hover { color: #111; }
  .pf-meta-editable {
    cursor: pointer; display: inline-flex; align-items: center; gap: .3rem;
    border-bottom: 1px dashed #ccc; transition: border-color .15s;
  }
  .pf-meta-editable:hover { border-color: #111; }
  .pf-meta-edit-ico { opacity: 0; transition: opacity .15s; display: flex; }
  .pf-meta-editable:hover .pf-meta-edit-ico { opacity: 1; }

  /* Info */
  .pf-info { flex: 1; min-width: 0; }
  .pf-name-row {
    display: flex;
    align-items: center;
    gap: .75rem;
    flex-wrap: wrap;
    margin-bottom: .4rem;
  }
  .pf-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem; letter-spacing: .04em;
    color: #111; margin: 0;
  }
  .pf-verified {
    display: inline-flex;
    align-items: center;
    gap: .3rem;
    font-size: .72rem;
    font-weight: 700;
    color: #3D47C8;
    background: #eef0fb;
    padding: .25rem .65rem;
    border-radius: 20px;
    letter-spacing: .04em;
  }

  /* Meta list */
  .pf-meta-list {
    display: flex;
    flex-direction: column;
    gap: .45rem;
    margin-bottom: .75rem;
  }
  .pf-meta-item {
    display: flex;
    align-items: center;
    gap: .35rem;
    font-size: .8rem;
    color: #666;
  }

  /* Badges accesibilidad */
  .pf-badges { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center; }
  .pf-badge {
    display: inline-flex;
    align-items: center;
    gap: .3rem;
    font-size: .7rem; font-weight: 700; letter-spacing: .05em;
    text-transform: uppercase; color: #111; background: #f0f0f0;
    padding: .3rem .7rem; border-radius: 20px;
    border: 1px solid #e0e0e0;
  }
  .pf-badge-more {
    font-size: .7rem; font-weight: 700; color: #3D47C8;
    background: none; border: 1px solid #3D47C8;
    padding: .3rem .7rem; border-radius: 20px;
    cursor: pointer; letter-spacing: .04em;
    transition: background .15s, color .15s;
  }
  .pf-badge-more:hover { background: #3D47C8; color: #fff; }

  /* Acciones */
  .pf-hero-actions {
    display: flex; flex-direction: column; gap: .5rem; align-items: flex-end;
  }
  .pf-btn-edit {
    display: flex; align-items: center; gap: .4rem;
    background: none; border: 1.5px solid #111; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .75rem;
    font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    padding: .5rem 1rem; min-height: 40px;
    transition: background .15s, color .15s;
    white-space: nowrap; color: #111;
  }
  .pf-btn-edit:hover { background: #111; color: #fff; }
  .pf-btn-logout {
    display: flex; align-items: center; gap: .35rem;
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .75rem;
    color: #c0392b; padding: 0; transition: opacity .15s;
  }
  .pf-btn-logout:hover { opacity: .7; }

  /* Panel edición */
  .pf-edit {
    background: #f9f9f9;
    border: 1.5px solid #e5e5e5;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  .pf-section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem; letter-spacing: .04em;
    color: #111; margin: 0 0 1.25rem;
  }
  .pf-edit-row { display: flex; gap: 2.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .pf-edit-group { flex: 1; min-width: 220px; }
  .pf-edit-label {
    font-size: .73rem; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: #555; margin: 0 0 .6rem;
  }
  .pf-chips { display: flex; flex-wrap: wrap; gap: .5rem; }
  .pf-chip {
    display: inline-flex; align-items: center; gap: .35rem;
    font-family: 'Inter', sans-serif; font-size: .75rem; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    border: 1.5px solid #ccc; background: transparent; color: #666;
    padding: .45rem .9rem; cursor: pointer;
    transition: all .15s; min-height: 36px;
  }
  .pf-chip:hover { border-color: #111; color: #111; }
  .pf-chip--on  { border-color: #111; background: #111; color: #fff; }
  .pf-chip-check { font-size: .7rem; }
  .pf-chip-remove { font-size: .65rem; opacity: .7; margin-left: .1rem; }
  .pf-btn-save {
    background: #111; color: #fff; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .75rem;
    font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    padding: .7rem 1.5rem; min-height: 40px; transition: background .15s;
  }
  .pf-btn-save:hover:not(:disabled) { background: #333; }
  .pf-btn-save:disabled { opacity: .5; cursor: default; }

  /* Recomendaciones y Favoritos */
  .pf-recs { margin-bottom: 3rem; }
  .pf-recs-subtitle { font-size: .82rem; color: #888; margin: -.7rem 0 1.5rem; }
  .pf-recs-hint { font-size: .85rem; color: #777; margin: -.5rem 0 1.5rem; }
  .pf-recs-link {
    background: none; border: none; cursor: pointer;
    color: #111; font-weight: 700; text-decoration: underline;
    font-size: inherit; padding: 0;
  }
  .pf-loading { display: flex; align-items: center; gap: .75rem; font-size: .85rem; color: #999; padding: 2.5rem 0; }
  .pf-spinner {
    display: inline-block; width: 18px; height: 18px;
    border: 2px solid #e0e0e0; border-top-color: #111;
    border-radius: 50%; animation: pf-spin .8s linear infinite; flex-shrink: 0;
  }
  @keyframes pf-spin { to { transform: rotate(360deg); } }
  .pf-error { display: flex; align-items: center; gap: 1rem; font-size: .85rem; color: #c0392b; padding: 1.5rem 0; }
  .pf-retry {
    background: none; border: 1.5px solid #c0392b; color: #c0392b;
    cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: .72rem; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; padding: .35rem .8rem; transition: all .15s;
  }
  .pf-retry:hover { background: #c0392b; color: #fff; }
  .pf-empty { font-size: .85rem; color: #999; padding: 2rem 0; }

  /* Estadísticas */
  .pf-stats {
    display: flex;
    align-items: center;
    gap: 0;
    background: #f9f9f9;
    border: 1.5px solid #e5e5e5;
    margin-bottom: 2rem;
    padding: 0;
    overflow: hidden;
  }
  .pf-stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.25rem 1rem;
    gap: .2rem;
    text-align: center;
  }
  .pf-stat-icon {
    font-size: 1rem;
    color: #e74c3c;
    display: flex;
    align-items: center;
    margin-bottom: .1rem;
  }
  .pf-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    line-height: 1;
    color: #111;
    letter-spacing: .03em;
  }
  .pf-stat-label {
    font-family: 'Inter', sans-serif;
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #999;
  }
  .pf-stat-divider {
    width: 1.5px;
    height: 60px;
    background: #e5e5e5;
    flex-shrink: 0;
  }

  /* Grid */
  .pf-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
  }

  /* Tarjeta */
  .pf-card {
    border: 1.5px solid #e5e5e5; cursor: pointer;
    transition: border-color .15s, transform .15s;
    overflow: hidden; background: #fff;
    display: flex; flex-direction: column;
  }
  .pf-card:hover { border-color: #111; transform: translateY(-2px); }
  .pf-card--fav:hover { border-color: #e74c3c; }
  .pf-card-cat {
    font-family: 'Inter', sans-serif; font-size: .65rem;
    font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: #fff; padding: .4rem .75rem;
  }
  .pf-card-img-wrap { width: 100%; height: 140px; overflow: hidden; background: #f0f0f0; flex-shrink: 0; }
  .pf-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .35s ease; }
  .pf-card:hover .pf-card-img { transform: scale(1.05); }
  .pf-card-body { padding: .85rem; display: flex; flex-direction: column; flex: 1; }
  .pf-card-title {
    font-family: 'Inter', sans-serif; font-size: .88rem; font-weight: 700;
    color: #111; margin: 0 0 .6rem; line-height: 1.35;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .pf-card-meta { display: flex; align-items: center; gap: .3rem; font-size: .73rem; color: #777; margin: .2rem 0; }
  .pf-card-price { font-size: .75rem; font-weight: 700; color: #111; margin: .5rem 0 .65rem; }
  .pf-card-link { display: inline-flex; align-items: center; gap: .3rem; font-size: .73rem; font-weight: 700; color: #111; margin-top: auto; }
  .pf-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: auto;
  }
  .pf-card-remove {
    background: none; border: 1.5px solid #e0e0e0; cursor: pointer;
    color: #bbb; padding: .35rem; display: flex; align-items: center;
    border-radius: 4px; transition: all .15s;
  }
  .pf-card-remove:hover { background: #fdf0ef; border-color: #e74c3c; color: #e74c3c; }

  /* Sección favoritos con separador */
  .pf-favs-section { border-top: 1.5px solid #e5e5e5; padding-top: 2rem; }
  .pf-favs-section .pf-section-title {
    display: flex; align-items: center; gap: .5rem; color: #111;
  }
  .pf-favs-section .pf-section-title svg { color: #e74c3c; }

  @media (max-width: 640px) {
    .pf-stats { flex-wrap: wrap; }
    .pf-stat-divider { display: none; }
    .pf-stat { flex: 1 1 33%; min-width: 100px; }
  }
`;