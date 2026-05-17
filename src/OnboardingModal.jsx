import { useState } from "react";
import { useAuth } from "./AuthContext";

const IcoMusica    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
const IcoTeatro    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-3 3-8c0 0 5 3 9 3s9-3 9-3c0 5 3 8 3 8"/><path d="M2 10s2 6 9 6c4 0 7-2 9-6"/><path d="M9 17c0 2 1.5 3 3 3s3-1 3-3"/></svg>;
const IcoExpo      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 4-4 4 4 4-4 4 4"/><path d="M3 15h18"/></svg>;
const IcoCine      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/></svg>;
const IcoDanza     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2"/><path d="m10.5 8.5-2 5 3 1 1 4h1l1-4 3-1-2-5"/><path d="m8.5 13.5-2 3M15.5 13.5l2 3"/></svg>;
const IcoCultura   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>;
const IcoSilla     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2"/><path d="M9 20l-1-7h8l-1 7"/><path d="M6 13H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2l2-3"/><path d="M18 13h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2l-2-3"/></svg>;
const IcoSignos    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11.5V14l-3 3"/><path d="M9.5 9.5 12 7l3 3"/><path d="m14.5 14.5 3 3"/><path d="M12 7V4"/><path d="M9.5 9.5 7 11.5"/><path d="m14.5 14.5-2.5 2-3-1"/><circle cx="16" cy="5" r="2"/></svg>;
const IcoPodo      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M5 9l7-7 7 7"/></svg>;
const IcoBucle     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>;

const CATEGORIAS = [
  { key: "Música",     Ico: IcoMusica  },
  { key: "Teatro",     Ico: IcoTeatro  },
  { key: "Exposición", Ico: IcoExpo    },
  { key: "Cine",       Ico: IcoCine    },
  { key: "Danza",      Ico: IcoDanza   },
  { key: "Cultura",    Ico: IcoCultura },
];

const ACCESIBILIDAD = [
  { key: "silla",  label: "Silla de ruedas", Ico: IcoSilla  },
  { key: "signos", label: "Lengua de signos", Ico: IcoSignos },
  { key: "podo",   label: "Podotáctil",       Ico: IcoPodo   },
  { key: "bucle",  label: "Bucle magnético",  Ico: IcoBucle  },
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

        {/* Arrow top-right */}
        <button
          className="ob-back"
          onClick={step === 1 ? onClose : () => setStep(1)}
          aria-label="Volver"
        >
          →
        </button>

        {step === 1 && (
          <>
            <h2 className="ob-title">Elige tus<br />categorías<br />favoritas</h2>
            <p className="ob-sub">Selecciona una o varias. Puedes cambiarlo después.</p>
            <div className="ob-chips">
              {CATEGORIAS.map(({ key, Ico }) => (
                <button
                  key={key}
                  className={`ob-chip${categorias.includes(key) ? " ob-chip--on" : ""}`}
                  onClick={() => toggleCat(key)}
                >
                  <span className="ob-chip-ico" aria-hidden="true"><Ico /></span>
                  <span className="ob-chip-txt">{key}</span>
                </button>
              ))}
            </div>
            <button className="ob-cta" onClick={() => setStep(2)} disabled={categorias.length === 0}>
              Continuar con estas categorías
            </button>
            <button className="ob-skip" onClick={() => setStep(2)}>Saltar este paso</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="ob-title">¿Qué<br />accesibilidad<br />necesitas?</h2>
            <p className="ob-sub">Esto nos ayuda a mostrarte eventos adaptados a ti.</p>
            <div className="ob-chips ob-chips--col">
              {ACCESIBILIDAD.map(({ key, label, Ico }) => (
                <button
                  key={key}
                  className={`ob-chip${accesib.includes(key) ? " ob-chip--on" : ""}`}
                  onClick={() => toggleAcc(key)}
                >
                  <span className="ob-chip-ico" aria-hidden="true"><Ico /></span>
                  <span className="ob-chip-txt">{label}</span>
                </button>
              ))}
            </div>
            {error && <p className="ob-error" role="alert">{error}</p>}
            <button className="ob-cta" onClick={guardar} disabled={loading}>
              {loading ? "Guardando…" : "Guardar y empezar"}
            </button>
            <button className="ob-skip" onClick={onClose}>Saltar este paso</button>
          </>
        )}

      </div>
      <style>{css}</style>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

  .ob-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1100; padding: 1rem;
  }

  .ob-box {
    background: #fff;
    width: 100%; max-width: 440px;
    min-height: 580px;
    border-radius: 10px;
    padding: 2.4rem 2.2rem 2rem;
    display: flex; flex-direction: column;
    gap: 1.1rem; position: relative;
    box-shadow: 0 24px 64px rgba(0,0,0,.22);
  }

  .ob-back {
    position: absolute; top: 14px; right: 14px;
    width: 34px; height: 34px; border-radius: 50%;
    background: #fff; border: 1.5px solid #ddd;
    cursor: pointer; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    color: #111; transition: background .15s;
  }
  .ob-back:hover { background: #eee; }

  .ob-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.6rem; line-height: 1.05;
    letter-spacing: .02em; color: #111; margin: 0;
  }

  .ob-sub {
    font-family: 'Inter', sans-serif;
    font-size: .78rem; color: #111; margin: 0; line-height: 1.5;
  }

  .ob-chips {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .ob-chips--col { grid-template-columns: 1fr; }

  .ob-chip {
    display: flex; align-items: center; gap: 8px;
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 8px; padding: 11px 13px;
    font-family: 'Inter', sans-serif;
    font-size: .8rem; font-weight: 600;
    cursor: pointer; text-align: left;
    transition: all .15s; min-height: 46px;
    color: #555;
  }
  .ob-chip-ico { display: flex; align-items: center; flex-shrink: 0; }
  .ob-chip-txt { transition: color .15s; }
  .ob-chip:hover {
    background: #111; border-color: #111; color: #fff;
  }
  .ob-chip--on {
    background: #111; border-color: #111; color: #fff;
  }

  .ob-cta {
    width: 100%; background: #333; color: #fff;
    border: none; border-radius: 6px; cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: .76rem; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    padding: 15px; min-height: 50px;
    transition: background .15s; margin-top: .25rem;
  }
  .ob-cta:hover:not(:disabled) { background: #111; }
  .ob-cta:disabled { opacity: .35; cursor: default; }

  .ob-skip {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: .73rem; color: #111;
    text-align: center; text-decoration: underline; padding: 0;
  }
  .ob-skip:hover { color: #444; }

  .ob-error {
    font-family: 'Inter', sans-serif;
    font-size: .78rem; color: #c0392b;
  }
`;