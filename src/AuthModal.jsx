import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import OnboardingModal from "./OnboardingModal";
import "./AuthModal.css";

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

  const boxRef = useRef(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = e => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, [mode]);

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

  return createPortal(
    <div className="am-overlay" role="dialog" aria-modal="true"
      aria-label={mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="am-box" ref={boxRef}>

        <div className="am-left" />

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
            <div className="am-field" style={{ display: mode === "register" ? "flex" : "none" }} aria-hidden={mode !== "register"}>
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

    </div>,
    document.body
  );
}


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

