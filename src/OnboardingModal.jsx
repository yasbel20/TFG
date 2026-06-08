import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "./AuthContext";
import { WheelIcon, HandsIcon, BucleIcon, PodoIcon } from "./AccessibilityIcons";
import "./OnboardingModal.css";

const IcoMusica    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
const IcoTeatro    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-3 3-8c0 0 5 3 9 3s9-3 9-3c0 5 3 8 3 8"/><path d="M2 10s2 6 9 6c4 0 7-2 9-6"/><path d="M9 17c0 2 1.5 3 3 3s3-1 3-3"/></svg>;
const IcoExpo      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 4-4 4 4 4-4 4 4"/><path d="M3 15h18"/></svg>;
const IcoCine      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/></svg>;
const IcoDanza     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2"/><path d="m10.5 8.5-2 5 3 1 1 4h1l1-4 3-1-2-5"/><path d="m8.5 13.5-2 3M15.5 13.5l2 3"/></svg>;
const IcoCultura   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>;
const IcoSilla  = () => <WheelIcon  size={18}/>;
const IcoSignos = () => <HandsIcon  size={18}/>;
const IcoPodo   = () => <PodoIcon   size={18}/>;
const IcoBucle  = () => <BucleIcon  size={18}/>;

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
  { key: "signos", label: "Lenguaje de signos", Ico: IcoSignos },
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
  const boxRef = useRef(null);

  // Focus trap: el foco cicla dentro del modal (WCAG 2.1.2).
  // Se recalcula en cada cambio de step porque los botones focusables cambian.
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
  }, [step]);

  // Toggle: si ya está seleccionado lo quita, si no lo añade
  const toggleCat = cat =>
    setCategorias(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const toggleAcc = key =>
    setAccesib(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );

  // Guarda preferencias en el backend y actualiza el usuario en el contexto global
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

  return createPortal(
    <div className="ob-overlay" role="dialog" aria-modal="true" aria-label="Configurar perfil">
      <div className="ob-box" ref={boxRef}>

        {/* Arrow top-right */}
        <button
          className="ob-back"
          onClick={step === 1 ? onClose : () => setStep(1)}
          aria-label={step === 1 ? "Cerrar" : "Volver al paso anterior"}
        >
          <span aria-hidden="true">→</span>
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
    </div>,
    document.body
  );
}