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
            {onMenuOpen && (
              <button className="nb-hamburger" onClick={onMenuOpen}
                aria-label="Abrir menú" aria-expanded={false}>
                <MenuIcon/>
              </button>
            )}
            <button className="nb-logo" onClick={() => navigate("/")} aria-label="INCLUGO — ir al inicio">
              INCLU<em>GO</em>
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
                      <span className="nb-user-name">{user.name}</span>
                      <span className="nb-user-email">{user.email}</span>
                      <button className="nb-user-menu-item" onClick={() => { setUserOpen(false); navigate("/perfil"); }}>
                        Mi perfil
                      </button>
                      <button className="nb-user-logout" onClick={() => { setUserOpen(false); logout(); }}>
                        Cerrar sesión
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
    background: #111; color: #fff;
    padding: .5rem 1rem;
    z-index: 9999;
    font-family: 'Inter', sans-serif;
    font-size: .85rem;
  }

  .nb-header {
    position: sticky;
    top: 0;
    z-index: 500;
    background: #ffffff;
    border-bottom: 1.5px solid #111111;
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
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.8rem, 3vw, 2.2rem);
    letter-spacing: .06em;
    color: #111111;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  .nb-logo em { font-style: normal; color: #555555; }

  .nb-links {
    display: flex;
    align-items: center;
    gap: clamp(.75rem, 2vw, 2rem);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nb-link {
    font-family: 'Inter', sans-serif;
    font-size: .78rem;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: #666666;
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
  .nb-link:hover, .nb-active { color: #111111; }

  .nb-drop-wrap { position: relative; }
  .nb-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    background: #111111;
    min-width: 210px;
    z-index: 600;
    display: flex;
    flex-direction: column;
    padding: .4rem 0;
    box-shadow: 0 8px 24px rgba(0,0,0,.18);
  }
  .nb-dropdown-item {
    background: none;
    border: none;
    cursor: pointer;
    color: #aaaaaa;
    font-family: 'Inter', sans-serif;
    font-size: .7rem;
    font-weight: 600;
    letter-spacing: .1em;
    padding: .65rem 1.25rem;
    text-align: left;
    transition: color .12s, background .12s;
  }
  .nb-dropdown-item:hover { color: #ffffff; background: rgba(255,255,255,.06); }

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
    border: 1.5px solid #CCCCCC;
    background: transparent;
    color: #555555;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color .15s, color .15s, background .15s;
    font-family: 'Inter', sans-serif;
    font-size: .85rem;
    font-weight: 700;
  }
  .nb-user-btn:hover { border-color: #111111; color: #111111; }
  .nb-user-btn--active { background: #111; color: #fff; border-color: #111; }
  .nb-user-btn--active:hover { background: #333; border-color: #333; color: #fff; }
  .nb-user-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: #fff;
    border: 1.5px solid #111;
    min-width: 180px;
    display: flex;
    flex-direction: column;
    padding: .5rem 0;
    z-index: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,.12);
  }
  .nb-user-name {
    font-family: 'Inter', sans-serif;
    font-size: .82rem; font-weight: 700;
    color: #111; padding: .4rem 1rem .1rem;
  }
  .nb-user-email {
    font-family: 'Inter', sans-serif;
    font-size: .73rem; color: #888;
    padding: 0 1rem .6rem;
    border-bottom: 1px solid #eee;
  }
  .nb-user-menu-item {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .75rem;
    font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
    color: #333; padding: .6rem 1rem; text-align: left;
    width: 100%; transition: background .12s;
    border-top: 1px solid #eee;
  }
  .nb-user-menu-item:hover { background: #f5f5f5; }
  .nb-user-logout {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .75rem;
    font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
    color: #c0392b; padding: .6rem 1rem; text-align: left;
    width: 100%; transition: background .12s;
    border-top: 1px solid #eee;
  }
  .nb-user-logout:hover { background: #fdf0ef; }

  .nb-hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: #111111;
    padding: .25rem;
    min-height: 44px;
    align-items: center;
  }

  @media (max-width: 768px) {
    .nb-links { display: none; }
    .nb-hamburger { display: flex; }
  }
`;
