import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HighContrastToggle from "./HighContrastToggle";
import { useAuth } from "./AuthContext";
import { useAccessibility } from "./AccessibilityContext";
import AuthModal from "./AuthModal";
import { CATEGORY_LIST } from "./constants/categories";
import { toSlug } from "./utils/formatting";
import "./Navbar.css";

const ChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function Navbar({ onMenuOpen }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const { prefs } = useAccessibility();
  const [evOpen,    setEvOpen]    = useState(false);
  const [authOpen,  setAuthOpen]  = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);
  const [mobOpen,   setMobOpen]   = useState(false);
  const evRef   = useRef(null);
  const userRef = useRef(null);

  const isEvents = location.pathname.startsWith("/eventos");
  const isAgenda = location.pathname === "/agenda";

  // Cierra dropdowns al hacer click fuera (ratón)
  useEffect(() => {
    const h = e => {
      if (evRef.current   && !evRef.current.contains(e.target))   setEvOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Mueve el foco al primer menuitem en cuanto el dropdown abre (solo sin modo teclado)
  useEffect(() => {
    if (evOpen && !prefs.keyboard) {
      setTimeout(() => {
        evRef.current?.querySelector('[role="menuitem"]')?.focus();
      }, 0);
    }
  }, [evOpen, prefs.keyboard]);

  useEffect(() => {
    if (userOpen) {
      setTimeout(() => {
        userRef.current?.querySelector('[role="menuitem"]')?.focus();
      }, 0);
    }
  }, [userOpen]);

  // Navegación con flechas dentro de un dropdown
  const handleDropdownKey = (e, ref, setOpen) => {
    const items = [...(ref.current?.querySelectorAll('[role="menuitem"]') ?? [])];
    const idx   = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx <= 0) ref.current?.querySelector('[aria-haspopup]')?.focus();
      else items[idx - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      ref.current?.querySelector('[aria-haspopup]')?.focus();
    }
  };

  const goEvents = (cat) => {
    setEvOpen(false);
    navigate(cat === "Todos" ? "/eventos" : `/eventos/${toSlug(cat)}`);
  };

  return (
    <>
      <header className="nb-header" role="banner">
        <a href="#hero-cta" className="nb-skip">Saltar al contenido principal</a>
        <nav className="nb-nav" aria-label="Navegación principal">

          {/* ── Izquierda: hamburger + logo ── */}
          <div className="nb-left">
            <button className="nb-hamburger" onClick={() => setMobOpen(true)}
              aria-label="Abrir menú" aria-expanded={mobOpen}>
              <MenuIcon/>
            </button>
            <button className="nb-logo" onClick={() => navigate("/")} aria-label="INCLUGO — ir al inicio">
              <img
                src="/img/InclugoLogo/LogoClaro.png"
                className="nb-logo-img nb-logo-img--light"
                alt="INCLUGO"
              />
              <img
                src="/img/InclugoLogo/LogoOscuro.png"
                className="nb-logo-img nb-logo-img--dark"
                alt="INCLUGO"
              />
            </button>
          </div>

          {/* ── Derecha: links + contraste + usuario ── */}
          <div className="nb-actions">
            <ul className="nb-links" role="list">
              <li
                ref={evRef}
                className="nb-drop-wrap"
                data-a11y-nav-item
                onBlur={e => {
                  if (!evRef.current?.contains(e.relatedTarget)) setEvOpen(false);
                }}
              >
                <button
                  className={`nb-link nb-link--arrow${evOpen || isEvents ? " nb-active" : ""}`}
                  onClick={() => setEvOpen(o => !o)}
                  onFocus={e => { if (e.target.matches(':focus-visible') || prefs.keyboard) setEvOpen(true); }}
                  onKeyDown={e => {
                    if (e.key === "ArrowDown") { e.preventDefault(); setEvOpen(true); }
                    if (e.key === "Escape" && evOpen) { e.preventDefault(); setEvOpen(false); }
                  }}
                  aria-expanded={evOpen}
                  aria-haspopup="menu"
                  aria-controls="ev-dropdown"
                >
                  Eventos <ChevronDown/>
                </button>
                {evOpen && (
                  <div
                    id="ev-dropdown"
                    className="nb-dropdown"
                    role="menu"
                    aria-label="Categorías de eventos"
                    onKeyDown={e => handleDropdownKey(e, evRef, setEvOpen)}
                  >
                    {CATEGORY_LIST.map(cat => (
                      <button key={cat} role="menuitem" className="nb-dropdown-item"
                        onClick={() => goEvents(cat)}>
                        {cat === "Todos" ? "TODOS LOS EVENTOS" : cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </li>
              <li data-a11y-nav-item>
                <button
                  className={`nb-link${isAgenda ? " nb-active" : ""}`}
                  onClick={() => navigate("/agenda")}
                >
                  Agenda
                </button>
              </li>
            </ul>

            <HighContrastToggle/>
            <div
              ref={userRef}
              className="nb-user-wrap"
              onBlur={e => {
                if (!userRef.current?.contains(e.relatedTarget)) setUserOpen(false);
              }}
            >
              {user ? (
                <>
                  <button
                    className="nb-user-btn nb-user-btn--active"
                    onClick={() => setUserOpen(o => !o)}
                    onFocus={e => { if (e.target.matches(':focus-visible')) setUserOpen(true); }}
                    onKeyDown={e => {
                      if (e.key === "ArrowDown") { e.preventDefault(); setUserOpen(true); }
                      if (e.key === "Escape" && userOpen) { e.preventDefault(); setUserOpen(false); }
                    }}
                    aria-label="Menú de usuario"
                    aria-expanded={userOpen}
                    aria-haspopup="menu"
                    aria-controls="user-dropdown"
                    style={{ padding: 0, overflow: "hidden" }}>
                    {user.avatar
                      ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                      : user.name.charAt(0).toUpperCase()
                    }
                  </button>
                  {userOpen && (
                    <div
                      id="user-dropdown"
                      className="nb-user-menu"
                      role="menu"
                      aria-label="Opciones de usuario"
                      onKeyDown={e => handleDropdownKey(e, userRef, setUserOpen)}
                    >
                      <div className="nb-user-header" aria-hidden="true">
                        <div className="nb-user-avatar">
                          {user.avatar
                            ? <img src={user.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }}/>
                            : user.name.charAt(0).toUpperCase()
                          }
                        </div>
                        <div>
                          <p className="nb-user-name">{user.name}</p>
                          <p className="nb-user-email">{user.email}</p>
                        </div>
                      </div>
                      <div className="nb-user-divider"/>
                      <button role="menuitem" className="nb-user-menu-item" onClick={() => { setUserOpen(false); navigate("/perfil"); }}>
                        <span className="nb-user-item-left"><ProfileIcon/> Mi perfil</span>
                        <ChevronRight/>
                      </button>
                      <div className="nb-user-divider"/>
                      <button role="menuitem" className="nb-user-logout" onClick={() => { setUserOpen(false); logout(); }}>
                        <LogoutIcon/> Cerrar sesión
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button className="nb-user-btn" aria-label="Iniciar sesión"
                  onClick={() => setAuthOpen(true)}>
                  <UserIcon/>
                </button>
              )}
            </div>
          </div>

        </nav>
      </header>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      {/* ── Menú móvil ── */}
      {mobOpen && <div className="nb-mob-overlay" onClick={() => setMobOpen(false)} aria-hidden="true" />}
      <div className={`nb-mob-menu${mobOpen ? " nb-mob-menu--open" : ""}`} role="dialog" aria-modal="true" aria-label="Menú principal" aria-hidden={!mobOpen} inert={!mobOpen}>
        <div className="nb-mob-header">
          <img src="/img/InclugoLogo/LogoClaro.png" className="nb-mob-logo nb-mob-logo--light" alt="INCLUGO" />
          <img src="/img/InclugoLogo/LogoOscuro.png" className="nb-mob-logo nb-mob-logo--dark" alt="INCLUGO" />
          <button className="nb-mob-close" onClick={() => setMobOpen(false)} aria-label="Cerrar menú">✕</button>
        </div>

        {/* ── Sección de usuario ── */}
        {user ? (
          <div className="nb-mob-user-section">
            <div className="nb-mob-user-header">
              <div className="nb-user-avatar">
                {user.avatar
                  ? <img src={user.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }}/>
                  : user.name.charAt(0).toUpperCase()
                }
              </div>
              <div>
                <p className="nb-user-name">{user.name}</p>
                <p className="nb-user-email">{user.email}</p>
              </div>
            </div>
            <button className="nb-mob-item" onClick={() => { setMobOpen(false); navigate("/perfil"); }}>
              Mi perfil <span className="nb-mob-chevron" aria-hidden="true">›</span>
            </button>
            <button className="nb-mob-item nb-mob-item--logout" onClick={() => { setMobOpen(false); logout(); }}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="nb-mob-user-section">
            <button className="nb-mob-item" onClick={() => { setMobOpen(false); setAuthOpen(true); }}>
              Iniciar sesión <span className="nb-mob-chevron" aria-hidden="true">›</span>
            </button>
          </div>
        )}

        <div className="nb-mob-divider" role="separator" />

        <nav aria-label="Menú de navegación">
          <ul className="nb-mob-list">
            <li>
              <button
                className="nb-mob-item"
                onClick={() => { setMobOpen(false); navigate("/eventos"); }}
              >
                Todos los eventos
                <span className="nb-mob-chevron" aria-hidden="true">›</span>
              </button>
            </li>
            {CATEGORY_LIST.filter(c => c !== "Todos").map(cat => (
              <li key={cat}>
                <button className="nb-mob-sub-item" onClick={() => {
                  setMobOpen(false);
                  navigate(`/eventos/${toSlug(cat)}`);
                }}>
                  {cat}
                </button>
              </li>
            ))}
            <li>
              <button className="nb-mob-item" onClick={() => { setMobOpen(false); navigate("/agenda"); }}>
                Agenda
                <span className="nb-mob-chevron" aria-hidden="true">›</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

