import { useState } from "react";
import { useAuth } from "./AuthContext";
import OnboardingModal from "./OnboardingModal";

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [mode,       setMode]       = useState("login");
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [pass,       setPass]       = useState("");
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
      } else {
        await register(name, email, pass);
        setOnboarding(true);
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

  return (
    <div className="am-overlay" role="dialog" aria-modal="true"
      aria-label={mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="am-box">
        <button className="am-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <h2 className="am-title">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        <div className="am-tabs">
          <button className={`am-tab${mode==="login"?" am-tab--active":""}`}
            onClick={() => { setMode("login"); setError(""); }}>
            Entrar
          </button>
          <button className={`am-tab${mode==="register"?" am-tab--active":""}`}
            onClick={() => { setMode("register"); setError(""); }}>
            Registrarse
          </button>
        </div>

        <form onSubmit={submit} className="am-form" noValidate>
          {mode === "register" && (
            <label className="am-field">
              <span>Nombre</span>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                required autoComplete="name" placeholder="Tu nombre"/>
            </label>
          )}
          <label className="am-field">
            <span>Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email" placeholder="correo@ejemplo.com"/>
          </label>
          <label className="am-field">
            <span>Contraseña</span>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              required autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="Mínimo 8 caracteres"/>
          </label>

          {error && <p className="am-error" role="alert">{error}</p>}

          <button type="submit" className="am-submit" disabled={loading}>
            {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>
      </div>

      <style>{css}</style>
    </div>
  );
}

const css = `
  .am-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }
  .am-box {
    background: #fff;
    width: 100%; max-width: 400px;
    padding: 2rem;
    position: relative;
    border: 1.5px solid #111;
  }
  .am-close {
    position: absolute; top: 1rem; right: 1rem;
    background: none; border: none; cursor: pointer;
    font-size: 1rem; color: #666;
    min-height: 44px; min-width: 44px;
    display: flex; align-items: center; justify-content: center;
  }
  .am-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem; letter-spacing: .05em;
    color: #111; margin: 0 0 1.25rem;
  }
  .am-tabs {
    display: flex; gap: .5rem; margin-bottom: 1.5rem;
    border-bottom: 1.5px solid #e5e5e5;
  }
  .am-tab {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .78rem;
    font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
    color: #999; padding: .5rem .25rem;
    border-bottom: 2px solid transparent;
    margin-bottom: -1.5px;
    transition: color .15s, border-color .15s;
  }
  .am-tab--active { color: #111; border-bottom-color: #111; }
  .am-form { display: flex; flex-direction: column; gap: 1rem; }
  .am-field { display: flex; flex-direction: column; gap: .35rem; }
  .am-field span {
    font-family: 'Inter', sans-serif; font-size: .75rem;
    font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #555;
  }
  .am-field input {
    border: 1.5px solid #ccc; padding: .65rem .85rem;
    font-family: 'Inter', sans-serif; font-size: .9rem;
    outline: none; transition: border-color .15s;
    min-height: 44px;
  }
  .am-field input:focus { border-color: #111; }
  .am-error {
    font-family: 'Inter', sans-serif; font-size: .8rem;
    color: #c0392b; margin: 0;
  }
  .am-submit {
    background: #111; color: #fff; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .78rem;
    font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    padding: .85rem; min-height: 44px;
    transition: background .15s;
    margin-top: .25rem;
  }
  .am-submit:hover:not(:disabled) { background: #333; }
  .am-submit:disabled { opacity: .6; cursor: default; }
`;
