import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar";
import AccessibilityBadge from "./AccessibilityBadge";
import OnboardingModal from "./OnboardingModal";
import { WheelIcon, HandsIcon, BucleIcon, PodoIcon } from "./AccessibilityIcons";
import { CAT_ACCENT } from "./constants/categories";
import { ACCESS_INFO } from "./constants/accessibility";
import "./PerfilPage.css";

/* ── Constantes ── */
const ACCESIBILIDAD_ICONS = {
  silla:  WheelIcon,
  signos: HandsIcon,
  podo:   PodoIcon,
  bucle:  BucleIcon,
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
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
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
                <h2 className="pf-sidebar-name">¡Hola! {user.name}</h2>
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
              <SettingsIcon /> Preferencias
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
              <section className="pf-stats reveal" aria-label="Estadísticas de perfil">
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
              <div className="pf-acc-callout reveal">
                <div className="pf-acc-callout-text">
                  <h3 className="pf-acc-callout-title">Haz que tu experiencia sea más cómoda</h3>
                  <p className="pf-acc-callout-desc">
                    Customiza tus herramientas para disfrutar eventos sin ninguna barrera para ti.
                  </p>
                  <button className="pf-acc-callout-btn" onClick={() => setActiveTab("accesibilidad")}>
                    Configurar preferencias 
                  </button>
                </div>
                <div className="pf-acc-callout-icons">
                  <div className="pf-acc-icon-item">
                    <span className="pf-acc-icon-circle"><WheelIcon size={22} /></span>
                    <span>Silla de ruedas</span>
                  </div>
                  <div className="pf-acc-icon-item">
                    <span className="pf-acc-icon-circle"><BucleIcon size={22} /></span>
                    <span>Bucle magnético</span>
                  </div>
                  <div className="pf-acc-icon-item">
                    <span className="pf-acc-icon-circle"><PodoIcon size={22} /></span>
                    <span>Podotáctil</span>
                  </div>
                  <div className="pf-acc-icon-item">
                    <span className="pf-acc-icon-circle"><HandsIcon size={22} /></span>
                    <span>Lengua de signos</span>
                  </div>
                </div>
              </div>

              {/* Eventos recomendados */}
              <section className="pf-recs reveal">
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
                          <img className="pf-card-img" src={ev.image || CAT_IMAGES[ev.cat] || CAT_IMAGES["Cultura"]} alt={ev.title} loading="lazy" onError={e => { e.currentTarget.src = CAT_IMAGES[ev.cat] ?? CAT_IMAGES["Cultura"]; }} />
                          <span className="pf-card-cat" style={{ background: CAT_ACCENT[ev.cat] ?? "#111" }}>{ev.cat}</span>
                        </div>
                        <div className="pf-card-body">
                          <h3 className="pf-card-title">{ev.title}</h3>
                          <p className="pf-card-meta"><CalIcon /> {ev.dateShort}{ev.timeStr && <> · {ev.timeStr}</>}</p>
                          <p className="pf-card-meta"><PinIcon /> {ev.venue}</p>
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
            <section className="pf-recs pf-favs-section reveal">
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
                        <img className="pf-card-img" src={ev.image || CAT_IMAGES[ev.cat] || CAT_IMAGES["Cultura"]} alt={ev.title} loading="lazy" onError={e => { e.currentTarget.src = CAT_IMAGES[ev.cat] ?? CAT_IMAGES["Cultura"]; }} />
                        <span className="pf-card-cat" style={{ background: CAT_ACCENT[ev.cat] ?? "#111" }}>{ev.cat}</span>
                      </div>
                      <div className="pf-card-body">
                        <h3 className="pf-card-title">{ev.title}</h3>
                        <p className="pf-card-meta"><CalIcon /> {ev.dateShort ?? ev.date}{ev.timeStr && <> · {ev.timeStr}</>}</p>
                        <p className="pf-card-meta"><PinIcon /> {ev.venueRaw ?? ev.venue}</p>
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
            <section className="pf-edit reveal">
              <h2 className="pf-section-title">Editar preferencias</h2>
              <div className="pf-edit-row">
                <div className="pf-edit-group">
                  <p className="pf-edit-label">Tipos de evento</p>
                  <div className="pf-chips">
                    {["Música","Teatro","Exposición","Cine","Danza","Cultura"].map(cat => {
                      const active = categorias.includes(cat);
                      return (
                        <button key={cat} className={`pf-chip${active ? " pf-chip--on" : ""}`} onClick={() => toggleCat(cat)}>
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="pf-edit-group">
                  <p className="pf-edit-label">Accesibilidad</p>
                  <div className="pf-chips">
                    {Object.entries(ACCESS_INFO).filter(([key]) => ACCESIBILIDAD_ICONS[key]).map(([key, { label }]) => {
                      const active = accesib.includes(key);
                      return (
                        <button key={key} className={`pf-chip${active ? " pf-chip--on" : ""}`} onClick={() => toggleAcc(key)}>
                          {(() => { const Icon = ACCESIBILIDAD_ICONS[key]; return Icon ? <Icon size={14}/> : null; })()}
                          {label}
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
    </>
  );
}

/* ── Estilos ── */
