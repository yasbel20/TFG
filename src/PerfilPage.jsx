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
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
  </svg>
);

const WheelchairIcon = () => (
  <svg width="22" height="22" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
    <circle cx="52" cy="10" r="9"/>
    <path d="M35 28c0-2 1.5-3.5 3.5-3.5h16c4 0 6 2.5 5.5 6L57 48h14c2 0 3.5 1.5 3.5 3.5S73 55 71 55H55l-3 13c6 2 10 7.5 10 14a15 15 0 0 1-30 0c0-7 4.5-13 11-14.5L47 48H38.5A3.5 3.5 0 0 1 35 44.5V28z"/>
    <circle cx="42" cy="82" r="13" fill="none" stroke="currentColor" strokeWidth="6"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M2 12c2.5-5 5.5-7 10-7s7.5 2 10 7c-2.5 5-5.5 7-10 7s-7.5-2-10-7z"/>
    <circle cx="12" cy="12" r="2.8" fill="currentColor" stroke="none"/>
  </svg>
);

const EarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 7a6 6 0 0 0-12 0c0 3 1.5 4.5 3 6s2 3 1 5"/>
    <path d="M10.5 18.5A2.5 2.5 0 0 0 13 21h.5a2.5 2.5 0 0 0 2.5-2.5"/>
    <circle cx="12" cy="10" r="2" fill="currentColor" stroke="none"/>
  </svg>
);

const HandIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v9M9 5v7M6 7v5c0 3.3 2.7 6 6 6s6-2.7 6-6V7"/>
    <path d="M15 5v7"/>
  </svg>
);

/* ── Componente principal ── */
export default function PerfilPage() {
  const { user, authFetch, logout, setUser, favs, favIds, removeFav } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showOnboarding, setShowOnboarding] = useState(location.state?.onboarding === true);
  const [activeTab,      setActiveTab]      = useState("perfil");
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loadingRec,      setLoadingRec]      = useState(true);
  const [errorRec,        setErrorRec]        = useState(false);
  const [categorias,      setCategorias]      = useState(user?.categorias_favoritas ?? []);
  const [accesib,         setAccesib]         = useState(user?.accesibilidad_preferida ?? []);
  const [guardando,       setGuardando]       = useState(false);

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
    } finally { setSavingInfo(false); }
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
    setCategorias(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const toggleAcc = key =>
    setAccesib(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

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
      setActiveTab("perfil");
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
  const mesRegistro = new Date(user.created_at || Date.now())
    .toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  return (
    <>
      <Navbar />
      <div className="pf-layout">

        {/* ── SIDEBAR ── */}
        <aside className="pf-sidebar">

          <div className="pf-sidebar-profile">
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

            {/* Nombre */}
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
                <h2 className="pf-sidebar-name">¡Hola! {user.name} 👋</h2>
                <button className="pf-inline-btn" onClick={() => { setTmpNombre(user.name); setEditNombre(true); }} title="Editar nombre">
                  <PencilIcon />
                </button>
              </div>
            )}

            <p className="pf-sidebar-desc">
              Cambia tus intereses y necesidades para recomendarte experiencias culturales inclusivas.
            </p>

            <button className="pf-sidebar-edit-btn" onClick={() => setActiveTab("accesibilidad")}>
              <PencilIcon /> Editar perfil
            </button>
          </div>

          {/* Navegación */}
          <nav className="pf-sidebar-nav" aria-label="Navegación del perfil">
            <button
              className={`pf-nav-item${activeTab === "perfil" ? " pf-nav-item--active" : ""}`}
              onClick={() => setActiveTab("perfil")}
            >
              <UserIcon /> Mi perfil
            </button>
            <button
              className={`pf-nav-item${activeTab === "favoritos" ? " pf-nav-item--active" : ""}`}
              onClick={() => setActiveTab("favoritos")}
            >
              <HeartFilledIcon /> Favoritos
              {favs.length > 0 && <span className="pf-nav-badge">{favs.length}</span>}
            </button>
            <button
              className={`pf-nav-item${activeTab === "accesibilidad" ? " pf-nav-item--active" : ""}`}
              onClick={() => setActiveTab("accesibilidad")}
            >
              <SettingsIcon /> Accesibilidad
            </button>
          </nav>

          <button className="pf-sidebar-logout" onClick={() => { logout(); navigate("/"); }}>
            <LogoutIcon /> Cerrar sesión
          </button>
        </aside>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <main id="main-content" className="pf-content">

          {/* ── TAB: MI PERFIL ── */}
          {activeTab === "perfil" && (
            <>
              {/* Estadísticas */}
              <section className="pf-stats" aria-label="Estadísticas de perfil">
                <div className="pf-stat">
                  <span className="pf-stat-num">{favs.length}</span>
                  <span className="pf-stat-label">Favoritos</span>
                </div>
                <div className="pf-stat-divider" aria-hidden="true" />
                <div className="pf-stat">
                  <span className="pf-stat-num">{user.categorias_favoritas?.length ?? 0}</span>
                  <span className="pf-stat-label">Categorías</span>
                </div>
                <div className="pf-stat-divider" aria-hidden="true" />
                <div className="pf-stat">
                  <span className="pf-stat-num">{user.accesibilidad_preferida?.length ?? 0}</span>
                  <span className="pf-stat-label">Accesibilidad</span>
                </div>
              </section>

              {/* Callout accesibilidad */}
              <div className="pf-acc-callout">
                <div className="pf-acc-callout-text">
                  <h3 className="pf-acc-callout-title">Haz que tu experiencia sea más cómoda</h3>
                  <p className="pf-acc-callout-desc">
                    Customiza tus herramientas para disfrutar eventos sin ninguna barrera para ti.
                  </p>
                  <button className="pf-acc-callout-btn" onClick={() => setActiveTab("accesibilidad")}>
                    Configurar accesibilidad
                  </button>
                </div>
                <div className="pf-acc-callout-icons">
                  <div className="pf-acc-icon-item">
                    <span className="pf-acc-icon-circle"><WheelchairIcon /></span>
                    <span>Movilidad</span>
                  </div>
                  <div className="pf-acc-icon-item">
                    <span className="pf-acc-icon-circle"><HandIcon /></span>
                    <span>Lengua de signos</span>
                  </div>
                  <div className="pf-acc-icon-item">
                    <span className="pf-acc-icon-circle"><EyeIcon /></span>
                    <span>Visual</span>
                  </div>
                  <div className="pf-acc-icon-item">
                    <span className="pf-acc-icon-circle"><EarIcon /></span>
                    <span>Auditivo</span>
                  </div>
                </div>
              </div>

              {/* Eventos recomendados */}
              <section className="pf-recs">
                <div className="pf-section-header">
                  <h2 className="pf-section-title">
                    {tienePreferencias ? "Eventos recomendados para ti" : "Eventos destacados"}
                  </h2>
                  <button className="pf-view-all" onClick={() => navigate("/eventos")}>
                    Ver todos los eventos <ArrowIcon />
                  </button>
                </div>

                {!tienePreferencias && (
                  <p className="pf-recs-hint">
                    Completa tus preferencias para ver eventos personalizados.{" "}
                    <button className="pf-recs-link" onClick={() => setActiveTab("accesibilidad")}>
                      Configurar ahora
                    </button>
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
                    <button className="pf-retry" onClick={cargarRecomendaciones}>Reintentar</button>
                  </div>
                ) : recomendaciones.length === 0 ? (
                  <p className="pf-empty">No hay eventos disponibles con tus preferencias actuales.</p>
                ) : (
                  <div className="pf-grid">
                    {recomendaciones.map(ev => (
                      <article
                        key={ev.id}
                        className="pf-card"
                        onClick={() => navigate(`/evento/${ev.id}`, { state: { ev } })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === "Enter" && navigate(`/evento/${ev.id}`, { state: { ev } })}
                      >
                        <div className="pf-card-img-wrap">
                          <img className="pf-card-img" src={CAT_IMAGES[ev.cat] ?? CAT_IMAGES["Cultura"]} alt="" loading="lazy" />
                          <span className="pf-card-cat" style={{ background: CAT_COLORS[ev.cat] ?? "#111" }}>{ev.cat}</span>
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
            </>
          )}

          {/* ── TAB: FAVORITOS ── */}
          {activeTab === "favoritos" && (
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
                      <div className="pf-card-img-wrap">
                        <img className="pf-card-img" src={CAT_IMAGES[ev.cat] ?? CAT_IMAGES["Cultura"]} alt="" loading="lazy" />
                        <span className="pf-card-cat" style={{ background: CAT_COLORS[ev.cat] ?? "#111" }}>{ev.cat}</span>
                      </div>
                      <div className="pf-card-body">
                        <h3 className="pf-card-title">{ev.title}</h3>
                        <p className="pf-card-meta"><CalIcon /> {ev.dateShort ?? ev.date}{ev.timeStr && <> · {ev.timeStr}</>}</p>
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
          )}

          {/* ── TAB: ACCESIBILIDAD ── */}
          {activeTab === "accesibilidad" && (
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
                          <span aria-hidden="true">{ACCESIBILIDAD_ICONS[key]}</span>
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

        </main>
      </div>
      <style>{css}</style>
    </>
  );
}

/* ── Estilos ── */
const css = `
  .pf-layout {
    display: flex;
    min-height: calc(100vh - 60px);
    font-family: 'Inter', var(--ff-b), system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    background: linear-gradient(to right, #fff 290px, #f5f4fc 290px);
  }

  /* ── SIDEBAR ── */
  .pf-sidebar {
    width: 290px; min-width: 290px;
    background: transparent;
    border-right: 1px solid #e8e4f0;
    display: flex; flex-direction: column;
    padding: 2.25rem 1.5rem 1.75rem;
    position: sticky; top: 0;
    height: calc(100vh - 60px);
    overflow-y: auto;
  }

  .pf-sidebar-profile {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    padding-bottom: 2rem;
    border-bottom: 1px solid #ede9f8;
    margin-bottom: 1.75rem;
  }

  .pf-avatar-wrap { position: relative; margin-bottom: 1.1rem; }
  .pf-avatar, .pf-avatar-img {
    width: 96px; height: 96px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 3px solid var(--brand);
  }
  .pf-avatar {
    background: var(--brand); color: var(--on-brand);
    font-family: 'Bebas Neue', var(--ff-h), sans-serif; font-size: 2.6rem;
  }
  .pf-avatar-img { object-fit: cover; }
  .pf-avatar-edit {
    position: absolute; bottom: 3px; right: 3px;
    width: 30px; height: 30px; border-radius: 50%;
    background: #fff; border: 1.5px solid #e8e4f0;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-muted);
    transition: background .15s, color .15s, border-color .15s;
    box-shadow: 0 1px 6px rgba(0,0,0,.12);
  }
  .pf-avatar-edit:hover { background: var(--brand); color: #fff; border-color: var(--brand); }

  .pf-inline-edit { display: flex; align-items: center; gap: .4rem; flex-wrap: nowrap; }
  .pf-inline-input {
    border: 1.5px solid var(--brand); background: #fff;
    padding: .4rem .7rem;
    font-family: 'Inter', var(--ff-b), sans-serif; font-size: 1rem;
    outline: none; min-width: 0; flex: 1; color: var(--text-primary); border-radius: 6px;
  }
  .pf-inline-save {
    background: var(--brand); color: var(--on-brand); border: none; cursor: pointer;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .88rem; font-weight: 700; padding: .38rem .65rem; border-radius: 6px;
    transition: background .15s;
  }
  .pf-inline-save:hover { background: var(--brand-hover); }
  .pf-inline-save:disabled { opacity: .5; }
  .pf-inline-cancel {
    background: none; border: 1.5px solid #e8e4f0; cursor: pointer;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .88rem; color: var(--text-muted); padding: .38rem .6rem; border-radius: 6px;
  }
  .pf-inline-btn { background: none; border: none; cursor: pointer; color: #ccc; padding: .25rem; display: inline-flex; align-items: center; transition: color .15s; }
  .pf-inline-btn:hover { color: var(--brand); }

  .pf-name-row { display: flex; align-items: center; justify-content: center; gap: .6rem; flex-wrap: wrap; margin-bottom: .4rem; }
  .pf-sidebar-name {
    font-family: 'Bebas Neue', var(--ff-h), sans-serif;
    font-size: 1.4rem; color: var(--text-primary); margin: 0; letter-spacing: .04em;
  }
  .pf-sidebar-desc {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .88rem; color: var(--text-muted); margin: .5rem 0 1.25rem; line-height: 1.55;
  }
  .pf-sidebar-edit-btn {
    display: inline-flex; align-items: center; gap: .45rem;
    background: transparent; border: 1.5px solid var(--brand);
    color: var(--brand);
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .82rem; font-weight: 700; letter-spacing: .04em;
    padding: .5rem 1.1rem; cursor: pointer; border-radius: 8px;
    transition: background .15s, color .15s;
  }
  .pf-sidebar-edit-btn:hover { background: var(--brand); color: #fff; }

  .pf-sidebar-nav { display: flex; flex-direction: column; gap: .2rem; flex: 1; }
  .pf-nav-item {
    display: flex; align-items: center; gap: .7rem;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted);
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .95rem; font-weight: 500;
    padding: .85rem 1rem; border-radius: 8px;
    text-align: left; transition: background .15s, color .15s;
  }
  .pf-nav-item:hover { background: #f0eeff; color: var(--brand); }
  .pf-nav-item--active { background: #ede9ff; color: var(--brand); font-weight: 700; }
  .pf-nav-badge {
    margin-left: auto; background: var(--brand); color: var(--on-brand);
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .72rem; font-weight: 800;
    padding: .14rem .5rem; border-radius: 20px; min-width: 22px; text-align: center;
  }

  .pf-sidebar-logout {
    display: flex; align-items: center; gap: .55rem;
    background: none; border: none; cursor: pointer; color: #bbb;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .9rem; padding: .75rem 1rem;
    margin-top: 1rem; border-radius: 8px;
    transition: color .15s, background .15s; text-align: left;
  }
  .pf-sidebar-logout:hover { color: var(--error); background: #fff5f5; }

  /* ── CONTENIDO ── */
  .pf-content { flex: 1; padding: 2.5rem clamp(1.25rem, 5vw, 3rem) 5rem; min-width: 0; overflow-y: auto; }

  /* Stats */
  .pf-stats {
    display: flex; align-items: center;
    background: #fff; border: 1px solid #e8e4f0;
    margin-bottom: 2.25rem; overflow: hidden; border-radius: 10px;
    box-shadow: 0 2px 10px rgba(99,82,200,.07);
  }
  .pf-stat {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 1.5rem 1rem; gap: .3rem; text-align: center;
  }
  .pf-stat-num {
    font-family: 'Bebas Neue', var(--ff-h), sans-serif;
    font-size: 2.6rem; line-height: 1; color: var(--brand); letter-spacing: .04em;
  }
  .pf-stat-label {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .78rem; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-muted);
  }
  .pf-stat-divider { width: 1px; height: 56px; background: #ede9f8; flex-shrink: 0; }

  /* Callout accesibilidad */
  .pf-acc-callout {
    background: #fff; border: 1px solid #e8e4f0;
    padding: 1.75rem; margin-bottom: 2.25rem;
    display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;
    border-radius: 10px; box-shadow: 0 2px 10px rgba(99,82,200,.06);
  }
  .pf-acc-callout-text { flex: 1; min-width: 0; }
  .pf-acc-callout-title {
    font-family: 'Bebas Neue', var(--ff-h), sans-serif;
    font-size: 1.5rem; color: var(--text-primary); margin: 0 0 .5rem; letter-spacing: .04em;
  }
  .pf-acc-callout-desc {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .92rem; color: var(--text-muted); margin: 0 0 1.25rem; line-height: 1.6;
  }
  .pf-acc-callout-btn {
    display: inline-flex; align-items: center; gap: .45rem;
    background: var(--brand); color: var(--on-brand); border: none; cursor: pointer;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .85rem; font-weight: 700; letter-spacing: .04em;
    padding: .65rem 1.35rem; border-radius: 8px; transition: background .15s;
  }
  .pf-acc-callout-btn:hover { background: var(--brand-hover); }
  .pf-acc-callout-icons { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; flex-shrink: 0; }
  .pf-acc-icon-item {
    display: flex; flex-direction: column; align-items: center; gap: .45rem;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .78rem; color: var(--text-muted); font-weight: 600; text-align: center;
  }
  .pf-acc-icon-circle {
    width: 52px; height: 52px; border-radius: 12px;
    background: #f0eeff; display: flex; align-items: center; justify-content: center; color: var(--brand);
  }

  /* Secciones */
  .pf-recs { margin-bottom: 3rem; }
  .pf-section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.5rem; }
  .pf-section-title {
    font-family: 'Bebas Neue', var(--ff-h), sans-serif;
    font-size: 1.75rem; letter-spacing: .04em; color: var(--text-primary); margin: 0 0 1.5rem;
  }
  .pf-section-header .pf-section-title { margin: 0; }
  .pf-view-all {
    display: inline-flex; align-items: center; gap: .35rem;
    background: none; border: none; cursor: pointer; color: var(--brand);
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .85rem; font-weight: 700; letter-spacing: .03em;
    padding: 0; transition: opacity .15s;
  }
  .pf-view-all:hover { opacity: .7; }
  .pf-recs-hint {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .92rem; color: var(--text-muted); margin: -.5rem 0 1.75rem; line-height: 1.5;
  }
  .pf-recs-link { background: none; border: none; cursor: pointer; color: var(--brand); font-weight: 700; text-decoration: underline; font-size: inherit; padding: 0; }
  .pf-loading {
    display: flex; align-items: center; gap: .8rem;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .92rem; color: var(--text-tertiary); padding: 2.5rem 0;
  }
  .pf-spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid #ede9f8; border-top-color: var(--brand); border-radius: 50%; animation: pf-spin .8s linear infinite; flex-shrink: 0; }
  @keyframes pf-spin { to { transform: rotate(360deg); } }
  .pf-error {
    display: flex; align-items: center; gap: 1rem;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .92rem; color: var(--error); padding: 1.5rem 0;
  }
  .pf-retry {
    background: none; border: 1.5px solid var(--error); color: var(--error); cursor: pointer;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .82rem; font-weight: 700; letter-spacing: .04em;
    padding: .4rem .9rem; border-radius: 6px; transition: all .15s;
  }
  .pf-retry:hover { background: var(--error); color: #fff; }
  .pf-empty {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .92rem; color: var(--text-tertiary); padding: 2.5rem 0; line-height: 1.6;
  }

  /* Grid */
  .pf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1.1rem; }

  /* Tarjeta */
  .pf-card {
    border: 1px solid #e8e4f0; cursor: pointer;
    transition: border-color .15s, box-shadow .15s, transform .15s;
    overflow: hidden; background: #fff; display: flex; flex-direction: column; border-radius: 10px;
  }
  .pf-card:hover { border-color: var(--brand); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(99,82,200,.12); }
  .pf-card--fav:hover { border-color: var(--error); box-shadow: 0 8px 24px rgba(220,38,38,.09); }
  .pf-card-img-wrap { width: 100%; height: 160px; overflow: hidden; position: relative; background: #f0eeff; flex-shrink: 0; }
  .pf-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s ease; }
  .pf-card:hover .pf-card-img { transform: scale(1.05); }
  .pf-card-cat {
    position: absolute; top: .7rem; left: .7rem;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .7rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase;
    color: #fff; padding: .35rem .7rem; border-radius: 5px;
  }
  .pf-card-body { padding: 1.1rem; display: flex; flex-direction: column; flex: 1; }
  .pf-card-title {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: 1rem; font-weight: 700; color: var(--text-primary);
    margin: 0 0 .6rem; line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .pf-card-meta {
    display: flex; align-items: center; gap: .35rem;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .82rem; color: var(--text-muted); margin: .25rem 0;
  }
  .pf-card-price {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .85rem; font-weight: 700; color: var(--brand); margin: .6rem 0 .7rem;
  }
  .pf-card-link {
    display: inline-flex; align-items: center; gap: .35rem;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .82rem; font-weight: 700; color: var(--brand); margin-top: auto;
  }
  .pf-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  .pf-card-remove {
    background: none; border: 1px solid #e8e4f0; cursor: pointer; color: #bbb;
    padding: .4rem; display: flex; align-items: center; border-radius: 6px; transition: all .15s;
  }
  .pf-card-remove:hover { border-color: var(--error); color: var(--error); background: #fff5f5; }

  /* Favoritos */
  .pf-favs-section .pf-section-title { display: flex; align-items: center; gap: .5rem; }
  .pf-favs-section .pf-section-title svg { color: var(--error); }

  /* Tab Accesibilidad */
  .pf-edit {
    background: #fff; border: 1px solid #e8e4f0;
    padding: 2rem; margin-bottom: 2rem; border-radius: 10px;
    box-shadow: 0 2px 10px rgba(99,82,200,.06);
  }
  .pf-edit-row { display: flex; gap: 2.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .pf-edit-group { flex: 1; min-width: 230px; }
  .pf-edit-label {
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .82rem; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; color: var(--text-muted); margin: 0 0 .8rem;
  }
  .pf-chips { display: flex; flex-wrap: wrap; gap: .55rem; }
  .pf-chip {
    display: inline-flex; align-items: center; gap: .4rem;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .85rem; font-weight: 600; letter-spacing: .03em;
    border: 1.5px solid #ddd8f0; background: transparent; color: var(--text-muted);
    padding: .5rem 1rem; cursor: pointer; transition: all .15s; min-height: 38px; border-radius: 8px;
  }
  .pf-chip:hover { border-color: var(--brand); color: var(--brand); background: #f7f5ff; }
  .pf-chip--on { border-color: var(--brand); background: var(--brand); color: var(--on-brand); }
  .pf-chip-check { font-size: .78rem; }
  .pf-chip-remove { font-size: .72rem; opacity: .7; margin-left: .1rem; }
  .pf-btn-save {
    background: var(--brand); color: var(--on-brand); border: none; cursor: pointer;
    font-family: 'Inter', var(--ff-b), sans-serif;
    font-size: .9rem; font-weight: 700; letter-spacing: .04em;
    padding: .8rem 1.75rem; min-height: 46px; border-radius: 8px; transition: background .15s;
  }
  .pf-btn-save:hover:not(:disabled) { background: var(--brand-hover); }
  .pf-btn-save:disabled { opacity: .5; cursor: default; }

  @media (max-width: 640px) {
    .pf-layout { flex-direction: column; background: #f5f4fc; }
    .pf-sidebar { width: 100%; min-width: 0; height: auto; position: static; background: #fff; border-right: none; border-bottom: 1px solid #e8e4f0; }
    .pf-acc-callout { flex-direction: column; }
    .pf-acc-callout-icons { grid-template-columns: repeat(4, 1fr); }
    .pf-stat-divider { display: none; }
    .pf-stat { flex: 1 1 33%; min-width: 100px; }
    .pf-grid { grid-template-columns: 1fr; }
  }
`;
