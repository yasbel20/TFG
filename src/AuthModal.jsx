import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import OnboardingModal from "./OnboardingModal";

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode,       setMode]       = useState("login");
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [pass,       setPass]       = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [onboarding, setOnboarding] = useState(false);

  if (onboarding) return <OnboardingModal onClose={onClose} />;

  const submit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, pass);
        onClose();
        navigate("/bienvenida");
      } else {
        await register(name, email, pass);
        onClose();
        navigate("/bienvenida", { state: { onboarding: true } });
      }
    } catch (err) {
      const msg = err?.errors
        ? Object.values(err.errors).flat().join(" ")
        : err?.message || "Error al conectar con el servidor";
      setError(msg);
    } finally {
      if (!onboarding) setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div className="am-overlay" role="dialog" aria-modal="true"
      aria-label={mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="am-box">

        {/* ── Panel izquierdo ── */}
        <div className="am-left">
          <div className="am-left-bottom">
            <p className="am-left-tagline">
              Descubre eventos culturales accesibles para todas las personas en Madrid
            </p>
          </div>
        </div>

        {/* ── Panel derecho ── */}
        <div className="am-right">
          <button className="am-close" onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </button>

          <div className="am-right-logo">
            <img src="/img/InclugoLogo/LogoClaro-sinfondo.png" alt="Inclugo" className="am-logo-img"/>
          </div>

          <h2 className="am-title">
            {mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h2>
          <p className="am-subtitle">
            {mode === "login"
              ? "Accede a tus eventos guardados y preferencias de accesibilidad."
              : "Empieza a explorar eventos accesibles adaptados a tus necesidades."}
          </p>

          <form onSubmit={submit} className="am-form" noValidate>
            <div className="am-field" style={{ visibility: mode === "register" ? "visible" : "hidden" }}>
              <label htmlFor="am-name">Tu nombre</label>
              <input id="am-name" type="text" value={name}
                onChange={e => setName(e.target.value)}
                required={mode === "register"} autoComplete="name" placeholder="María García"/>
            </div>

            <div className="am-field">
              <label htmlFor="am-email">Tu email</label>
              <input id="am-email" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required autoComplete="email" placeholder="correo@ejemplo.com"/>
            </div>

            <div className="am-field">
              <label htmlFor="am-pass">Contraseña</label>
              <div className="am-pass-wrap">
                <input id="am-pass" type={showPass ? "text" : "password"}
                  value={pass} onChange={e => setPass(e.target.value)}
                  required autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••••"/>
                <button type="button" className="am-pass-toggle"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && <p className="am-error" role="alert">{error}</p>}

            <button type="submit" className="am-submit" disabled={loading}>
              {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
            </button>
          </form>

          <p className="am-switch">
            {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <button type="button" onClick={switchMode}>
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}

const AccessIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="5" r="2"/>
    <path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z"/>
    <path d="M6 16a6 6 0 1 0 12 0" fill="none" strokeWidth="2"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const css = `
  .am-overlay {
    position: fixed; inset: 0;
    background: rgba(10, 12, 40, 0.65);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 1rem;
  }

  .am-box {
    display: flex;
    width: 100%; max-width: 820px;
    min-height: 520px;
    border-radius: 0;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,.35);
    background: #fff;
  }

  /* ── Panel izquierdo ── */
  .am-left {
    flex: 0 0 320px;
    background: url('/img/loginsilla.png') center/cover no-repeat;
    padding: 2.5rem;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .am-left::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10,14,60,.55) 0%,
      rgba(10,14,60,.25) 40%,
      rgba(10,14,60,.75) 100%
    );
  }
  .am-left::after { display: none; }
  .am-left-logo {
    position: relative; z-index: 1;
  }
  .am-logo-img {
    height: 36px; width: auto; display: block;
  }
  .am-left-bottom { position: relative; z-index: 1; margin-top: auto; }
  .am-left-eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: .75rem; font-weight: 600; letter-spacing: .12em;
    text-transform: uppercase; color: rgba(255,255,255,.65);
    margin: 0 0 .6rem;
  }
  .am-left-tagline {
    font-family: 'Inter', sans-serif;
    font-size: 1.35rem; font-weight: 700; line-height: 1.35;
    color: #fff; margin: 0;
  }

  /* ── Panel derecho ── */
  .am-right {
    flex: 1; padding: 2.5rem 2.75rem;
    display: flex; flex-direction: column;
    position: relative; background: #fff;
    overflow-y: auto;
  }
  .am-close {
    position: absolute; top: 1.25rem; right: 1.25rem;
    background: none; border: none; cursor: pointer;
    color: #9ca3af; width: 36px; height: 36px; border-radius: 0;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s, color .15s;
  }
  .am-close:hover { background: #f3f4f6; color: #374151; }

  .am-right-logo {
    margin-bottom: 1.5rem;
  }

  .am-title {
    font-family: 'Inter', sans-serif;
    font-size: 1.75rem; font-weight: 800;
    color: #111827; margin: 0 0 .5rem; line-height: 1.2;
  }
  .am-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: .9rem; color: #6b7280;
    margin: 0 0 1.75rem; line-height: 1.6; max-width: 340px;
  }

  /* ── Form ── */
  .am-form { display: flex; flex-direction: column; gap: 1.1rem; }

  .am-field { display: flex; flex-direction: column; gap: .45rem; }
  .am-field label {
    font-family: 'Inter', sans-serif;
    font-size: .85rem; font-weight: 600; color: #374151;
  }
  .am-field input {
    border: 1.5px solid #e5e7eb;
    border-radius: 0;
    padding: .7rem 1rem;
    font-family: 'Inter', sans-serif; font-size: .9rem;
    color: #111827; background: #fff;
    outline: none; transition: border-color .15s, box-shadow .15s;
    min-height: 46px; width: 100%; box-sizing: border-box;
  }
  .am-field input:focus {
    border-color: var(--brand, #3d47c8);
    box-shadow: 0 0 0 3px rgba(61,71,200,.12);
  }
  .am-field input::placeholder { color: #9ca3af; }

  .am-pass-wrap { position: relative; }
  .am-pass-wrap input { padding-right: 2.75rem; }
  .am-pass-toggle {
    position: absolute; right: .75rem; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #9ca3af; display: flex; align-items: center; justify-content: center;
    padding: .25rem; transition: color .15s;
  }
  .am-pass-toggle:hover { color: #374151; }

  .am-error {
    font-family: 'Inter', sans-serif; font-size: .82rem;
    color: #ef4444; margin: 0; padding: .5rem .75rem;
    background: #fef2f2; border-radius: 0;
    border: 1px solid #fecaca;
  }

  .am-submit {
    background: var(--brand, #3d47c8); color: #fff;
    border: none; border-radius: 0; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .95rem; font-weight: 700;
    padding: .85rem; min-height: 48px;
    transition: background .15s;
    margin-top: .25rem;
  }
  .am-submit:hover:not(:disabled) { background: #2d3ab8; }
  .am-submit:disabled { opacity: .6; cursor: default; }

  /* ── Switch ── */
  .am-switch {
    font-family: 'Inter', sans-serif; font-size: .875rem;
    color: #6b7280; text-align: center;
    margin: 1.25rem 0 0;
  }
  .am-switch button {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .875rem;
    font-weight: 700; color: var(--brand, #3d47c8);
    transition: color .15s; padding: 0;
  }
  .am-switch button:hover { color: #2d3ab8; text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .am-left { display: none; }
    .am-right { padding: 2rem 1.5rem; }
    .am-box { border-radius: 0; }
  }
`;
