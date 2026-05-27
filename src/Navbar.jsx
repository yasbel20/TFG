import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HighContrastToggle from "./HighContrastToggle";
import { useAuth } from "./AuthContext";
import AuthModal from "./AuthModal";

const CATS = ["Todos", "Música", "Teatro", "Exposición", "Cine", "Danza", "Cultura"];

const toSlug = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\s+/g,"-");

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
  const [evOpen,    setEvOpen]    = useState(false);
  const [authOpen,  setAuthOpen]  = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);
  const [mobOpen,   setMobOpen]   = useState(false);
  const evRef   = useRef(null);
  const userRef = useRef(null);

  const isEvents = location.pathname.startsWith("/eventos");
  const isAgenda = location.pathname === "/agenda";

  useEffect(() => {
    const h = e => {
      if (evRef.current   && !evRef.current.contains(e.target))   setEvOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const goEvents = (cat) => {
    setEvOpen(false);
    navigate(cat === "Todos" ? "/eventos" : `/eventos/${toSlug(cat)}`);
  };

  return (
    <>
      <style>{css}</style>
      <header className="nb-header" role="banner">
        <a href="#main-content" className="nb-skip">Saltar al contenido principal</a>
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
              <li ref={evRef} className="nb-drop-wrap">
                <button
                  className={`nb-link nb-link--arrow${evOpen || isEvents ? " nb-active" : ""}`}
                  onClick={() => setEvOpen(o => !o)}
                  aria-expanded={evOpen}
                  aria-haspopup="listbox"
                >
                  Eventos <ChevronDown/>
                </button>
                {evOpen && (
                  <div className="nb-dropdown" role="listbox">
                    {CATS.map(cat => (
                      <button key={cat} role="option" className="nb-dropdown-item"
                        onClick={() => goEvents(cat)}>
                        {cat === "Todos" ? "TODOS LOS EVENTOS" : cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </li>
              <li>
                <button
                  className={`nb-link${isAgenda ? " nb-active" : ""}`}
                  onClick={() => navigate("/agenda")}
                >
                  Agenda
                </button>
              </li>
            </ul>

            <HighContrastToggle/>
            <div ref={userRef} className="nb-user-wrap">
              {user ? (
                <>
                  <button className="nb-user-btn nb-user-btn--active"
                    onClick={() => setUserOpen(o => !o)}
                    aria-label="Menú de usuario" aria-expanded={userOpen}
                    style={{ padding: 0, overflow: "hidden" }}>
                    {user.avatar
                      ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                      : user.name.charAt(0).toUpperCase()
                    }
                  </button>
                  {userOpen && (
                    <div className="nb-user-menu">
                      <div className="nb-user-header">
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
                      <button className="nb-user-menu-item" onClick={() => { setUserOpen(false); navigate("/perfil"); }}>
                        <span className="nb-user-item-left"><ProfileIcon/> Mi perfil</span>
                        <ChevronRight/>
                      </button>
                      <div className="nb-user-divider"/>
                      <button className="nb-user-logout" onClick={() => { setUserOpen(false); logout(); }}>
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
      <div className={`nb-mob-menu${mobOpen ? " nb-mob-menu--open" : ""}`} role="dialog" aria-modal="true" aria-label="Menú principal">
        <div className="nb-mob-header">
          <img src="/img/InclugoLogo/LogoClaro.png" className="nb-mob-logo nb-mob-logo--light" alt="INCLUGO" />
          <img src="/img/InclugoLogo/LogoOscuro.png" className="nb-mob-logo nb-mob-logo--dark" alt="INCLUGO" />
          <button className="nb-mob-close" onClick={() => setMobOpen(false)} aria-label="Cerrar menú">✕</button>
        </div>
        <nav aria-label="Menú de navegación">
          <ul className="nb-mob-list">
            <li>
              <button
                className={`nb-mob-item${evOpen ? " nb-mob-item--open" : ""}`}
                onClick={() => setEvOpen(o => !o)}
                aria-expanded={evOpen}
              >
                Eventos
                <span className="nb-mob-chevron" aria-hidden="true">{evOpen ? "^" : "›"}</span>
              </button>
              {evOpen && (
                <ul className="nb-mob-sub">
                  {CATS.map(cat => (
                    <li key={cat}>
                      <button className="nb-mob-sub-item" onClick={() => {
                        setMobOpen(false);
                        setEvOpen(false);
                        navigate(cat === "Todos" ? "/eventos" : `/eventos/${toSlug(cat)}`);
                      }}>
                        {cat === "Todos" ? "Todos los eventos" : cat}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
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

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');

  .nb-skip {
    position: absolute;
    left: -9999px;
    top: auto;
  }
  .nb-skip:focus {
    position: fixed;
    top: 0; left: 0;
    background: var(--text-primary); color: var(--on-brand);
    padding: .5rem 1rem;
    z-index: 9999;
    font-family: var(--ff-b);
    font-size: .85rem;
  }

  .nb-header {
    position: sticky;
    top: 0;
    z-index: 500;
    background: var(--bg);
    border-bottom: none;
    box-shadow: 0 1px 0 var(--border);
  }

  .nb-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 68px;
    padding: 0 clamp(1.25rem, 5vw, 6rem);
    gap: 1.5rem;
  }

  .nb-left {
    display: flex;
    align-items: center;
    gap: .75rem;
    flex-shrink: 0;
  }
  .nb-logo {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }
  .nb-logo-img {
    height: clamp(48px, 6vw, 58px);
    width: auto;
    display: block;
  }
  .nb-logo-img--dark { display: none; }

  .hi-contrast .nb-logo-img--light { display: none; }
  .hi-contrast .nb-logo-img--dark  { display: block; }

  .nb-links {
    display: flex;
    align-items: center;
    gap: clamp(.75rem, 2vw, 2rem);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nb-link {
    font-family: var(--ff-b);
    font-size: .78rem;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: .5rem 0;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: color .15s;
    white-space: nowrap;
  }
  .nb-link:hover, .nb-active { color: var(--text-primary); }

  .nb-drop-wrap { position: relative; }
  .nb-dropdown {
    position: absolute;
    top: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg);
    min-width: 280px;
    z-index: 600;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    box-shadow: 0 16px 40px rgba(0,0,0,.10);
  }
  .nb-dropdown::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px; height: 10px;
    background: var(--bg);
    border-left: 1px solid var(--border);
    border-top: 1px solid var(--border);
    rotate: 45deg;
  }
  .nb-dropdown-item {
    background: none;
    border: none;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    color: var(--text-secondary);
    font-family: var(--ff-h);
    font-size: 1.9rem;
    letter-spacing: .04em;
    padding: .7rem 1.5rem;
    text-align: left;
    transition: color .15s, padding-left .15s, background .15s;
    position: relative;
    line-height: 1.1;
  }
  .nb-dropdown-item:last-child { border-bottom: none; }
  .nb-dropdown-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--brand);
    transform: scaleY(0);
    transition: transform .15s;
  }
  .nb-dropdown-item:hover {
    color: var(--brand);
    padding-left: 2rem;
    background: var(--brand-subtle);
  }
  .nb-dropdown-item:hover::before { transform: scaleY(1); }

  .nb-actions {
    display: flex;
    align-items: center;
    gap: clamp(.5rem, 1.5vw, 1.25rem);
    flex-shrink: 0;
  }
  .nb-user-wrap { position: relative; }
  .nb-user-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color .15s, color .15s, background .15s;
    font-family: var(--ff-b);
    font-size: .85rem;
    font-weight: 700;
  }
  .nb-user-btn:hover { border-color: var(--text-primary); color: var(--text-primary); }
  .nb-user-btn--active { background: var(--brand); color: var(--on-brand); border-color: var(--brand); }
  .nb-user-btn--active:hover { background: var(--brand-hover); border-color: var(--brand-hover); color: var(--on-brand); }
  .nb-user-menu {
    position: fixed;
    top: 68px;
    right: 1rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 0;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    padding: 0;
    z-index: 600;
    box-shadow: 0 16px 40px rgba(0,0,0,.10);
    animation: nb-menu-in .15s ease;
    overflow: hidden;
  }
  .nb-user-menu::before {
    content: none;
  }
  @keyframes nb-menu-in {
    from { opacity:0; transform:translateY(-6px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .nb-user-header {
    display: flex; align-items: center; gap: .75rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  .nb-user-avatar {
    width: 38px; height: 38px; border-radius: 0; flex-shrink: 0;
    background: var(--brand); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--ff-h); font-size: 1.2rem; font-weight: 400;
    overflow: hidden;
  }
  .nb-user-name {
    font-family: var(--ff-h);
    font-size: 1.2rem; font-weight: 400; letter-spacing: .04em;
    color: var(--text-primary); margin: 0 0 .1rem; text-transform: uppercase;
  }
  .nb-user-email {
    font-family: var(--ff-b);
    font-size: .75rem; color: var(--text-muted);
    margin: 0;
  }
  .nb-user-divider { display: none; }
  .nb-user-menu-item {
    background: none; border: none; border-bottom: 1px solid var(--border);
    cursor: pointer; font-family: var(--ff-h); font-size: 1.9rem;
    font-weight: 400; letter-spacing: .04em; color: var(--text-secondary);
    padding: .7rem 1.5rem; text-align: left; width: 100%; text-transform: uppercase;
    display: flex; align-items: center; justify-content: space-between;
    transition: color .15s, padding-left .15s, background .15s;
    position: relative; line-height: 1.1;
  }
  .nb-user-item-left { display: flex; align-items: center; gap: .6rem; }
  .nb-user-menu-item::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: var(--brand);
    transform: scaleY(0); transition: transform .15s;
  }
  .nb-user-menu-item:hover { color: var(--brand); padding-left: 2rem; background: var(--brand-subtle); }
  .nb-user-menu-item:hover::before { transform: scaleY(1); }
  .nb-user-logout {
    background: none; border: none; cursor: pointer;
    font-family: var(--ff-h); font-size: 1.9rem; font-weight: 400;
    letter-spacing: .04em; color: var(--text-secondary); padding: .7rem 1.5rem;
    text-transform: uppercase; text-align: left; width: 100%;
    display: flex; align-items: center; gap: .6rem;
    transition: color .15s, padding-left .15s, background .15s;
    position: relative; line-height: 1.1;
  }
  .nb-user-logout::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: var(--brand);
    transform: scaleY(0); transition: transform .15s;
  }
  .nb-user-logout:hover { color: var(--brand); padding-left: 2rem; background: var(--brand-subtle); }
  .nb-user-logout:hover::before { transform: scaleY(1); }

  .nb-hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-primary);
    padding: .25rem;
    min-height: 44px;
    align-items: center;
  }

  @media (max-width: 768px) {
    .nb-links { display: none; }
    .nb-hamburger { display: flex; }
  }

  /* ── Menú móvil ── */
  .nb-mob-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.35);
    z-index: 8999;
  }
  .nb-mob-menu {
    position: fixed;
    top: 0; left: 0; right: 0;
    background: #fff;
    z-index: 9000;
    transform: translateY(-100%);
    transition: transform .3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,.12);
    max-height: 90vh;
    overflow-y: auto;
  }
  .nb-mob-menu--open { transform: translateY(0); }

  .nb-mob-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .75rem 1.5rem;
  }
  .nb-mob-logo { height: 44px; width: auto; }
  .nb-mob-logo--dark { display: none; }
  .hi-contrast .nb-mob-logo--light { display: none; }
  .hi-contrast .nb-mob-logo--dark  { display: block; }
  .nb-mob-close {
    width: 40px; height: 40px;
    background: none; border: none;
    cursor: pointer; font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-muted);
    transition: color .15s;
  }
  .nb-mob-close:hover { color: var(--text-primary); }

  .nb-mob-list { list-style: none; margin: 0; padding: 0; }

  .nb-mob-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: none; border: none;
    padding: 1.25rem 1.5rem;
    cursor: pointer; text-align: left;
    font-family: var(--ff-h);
    font-size: 2rem;
    letter-spacing: .04em;
    color: var(--text-muted);
    transition: color .15s;
  }
  .nb-mob-item:hover,
  .nb-mob-item--open { color: var(--brand); }

  .nb-mob-chevron {
    font-size: 1.2rem;
    color: var(--text-tertiary);
    transition: color .15s;
  }
  .nb-mob-item:hover .nb-mob-chevron,
  .nb-mob-item--open .nb-mob-chevron { color: var(--brand); }

  .nb-mob-sub {
    list-style: none; margin: 0; padding: 0;
    border-left: 1px solid var(--border);
    margin-left: 2rem;
  }
  .nb-mob-sub-item {
    display: block; width: 100%;
    background: none; border: none;
    padding: .75rem 1.25rem;
    text-align: left; cursor: pointer;
    font-family: var(--ff-h);
    font-size: 1.6rem;
    letter-spacing: .04em;
    color: var(--text-muted);
    transition: color .15s;
  }
  .nb-mob-sub-item:hover { color: var(--brand); }
`;
