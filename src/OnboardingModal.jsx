import { useState } from "react";
import { useAuth } from "./AuthContext";

const CATEGORIAS = ["Música", "Teatro", "Exposición", "Cine", "Danza", "Cultura"];
const ACCESIBILIDAD = [
  { key: "silla",  label: "Silla de ruedas" },
  { key: "signos", label: "Lengua de signos" },
  { key: "podo",   label: "Podotáctil" },
  { key: "bucle",  label: "Bucle magnético" },
];

export default function OnboardingModal({ onClose }) {
  const { authFetch, setUser } = useAuth();
  const [step,       setStep]       = useState(1);
  const [categorias, setCategorias] = useState([]);
  const [accesib,    setAccesib]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const toggleCat = cat =>
    setCategorias(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const toggleAcc = key =>
    setAccesib(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );

  const guardar = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch("/perfil/preferencias", {
        method: "PUT",
        body: JSON.stringify({
          categorias_favoritas:    categorias,
          accesibilidad_preferida: accesib,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setUser(data);
      onClose();
    } catch {
      setError("No se pudieron guardar las preferencias.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ob-overlay" role="dialog" aria-modal="true" aria-label="Configurar perfil">
      <div className="ob-box">

        <div className="ob-progress">
          <div className={`ob-step${step >= 1 ? " ob-step--done" : ""}`}>1</div>
          <div className="ob-line"/>
          <div className={`ob-step${step >= 2 ? " ob-step--done" : ""}`}>2</div>
        </div>

        {step === 1 && (
          <>
            <h2 className="ob-title">¿Qué tipo de eventos te interesan?</h2>
            <p className="ob-sub">Selecciona uno o varios. Puedes cambiarlo después.</p>
            <div className="ob-chips">
              {CATEGORIAS.map(cat => (
                <button key={cat}
                  className={`ob-chip${categorias.includes(cat) ? " ob-chip--on" : ""}`}
                  onClick={() => toggleCat(cat)}>
                  {cat}
                </button>
              ))}
            </div>
            <button className="ob-next"
              onClick={() => setStep(2)}
              disabled={categorias.length === 0}>
              Siguiente →
            </button>
            <button className="ob-skip" onClick={() => setStep(2)}>
              Saltar este paso
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="ob-title">¿Qué accesibilidad necesitas?</h2>
            <p className="ob-sub">Esto nos ayuda a mostrarte eventos adaptados a ti.</p>
            <div className="ob-chips">
              {ACCESIBILIDAD.map(({ key, label }) => (
                <button key={key}
                  className={`ob-chip${accesib.includes(key) ? " ob-chip--on" : ""}`}
                  onClick={() => toggleAcc(key)}>
                  {label}
                </button>
              ))}
            </div>
            {error && <p className="ob-error" role="alert">{error}</p>}
            <button className="ob-next" onClick={guardar} disabled={loading}>
              {loading ? "Guardando..." : "Guardar y empezar"}
            </button>
            <button className="ob-skip" onClick={onClose}>
              Saltar este paso
            </button>
          </>
        )}

      </div>
      <style>{css}</style>
    </div>
  );
}

const css = `
  .ob-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.6);
    display: flex; align-items: center; justify-content: center;
    z-index: 1100; padding: 1rem;
  }
  .ob-box {
    background: #fff; border: 1.5px solid #111;
    width: 100%; max-width: 460px;
    padding: 2.5rem 2rem;
    display: flex; flex-direction: column; align-items: center;
    gap: 1.25rem; text-align: center;
  }
  .ob-progress {
    display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem;
  }
  .ob-step {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid #ccc; color: #ccc;
    font-family: 'Inter', sans-serif; font-size: .75rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    transition: all .2s;
  }
  .ob-step--done { border-color: #111; color: #fff; background: #111; }
  .ob-line { width: 40px; height: 2px; background: #e5e5e5; }
  .ob-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.7rem; letter-spacing: .04em; color: #111; margin: 0;
  }
  .ob-sub {
    font-family: 'Inter', sans-serif; font-size: .83rem; color: #777; margin: 0;
  }
  .ob-chips {
    display: flex; flex-wrap: wrap; gap: .6rem; justify-content: center;
  }
  .ob-chip {
    font-family: 'Inter', sans-serif; font-size: .78rem; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    border: 1.5px solid #ccc; background: transparent; color: #666;
    padding: .55rem 1.1rem; cursor: pointer;
    transition: all .15s; min-height: 44px;
  }
  .ob-chip:hover { border-color: #111; color: #111; }
  .ob-chip--on { border-color: #111; background: #111; color: #fff; }
  .ob-next {
    width: 100%; background: #111; color: #fff; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .78rem;
    font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    padding: .85rem; min-height: 44px; transition: background .15s;
  }
  .ob-next:hover:not(:disabled) { background: #333; }
  .ob-next:disabled { opacity: .45; cursor: default; }
  .ob-skip {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: .75rem; color: #aaa;
    text-decoration: underline; padding: 0;
  }
  .ob-skip:hover { color: #666; }
  .ob-error {
    font-family: 'Inter', sans-serif; font-size: .8rem; color: #c0392b;
  }
`;
