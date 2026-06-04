import { useRef, useEffect } from "react";

const Ico = ({ d, size = 16, fill = "none", stroke = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {typeof d === "string" ? <path d={d}/> : d}
  </svg>
);

const CloseIcon    = () => <Ico d="M18 6 6 18M6 6l12 12"/>;
const KeyboardIcon = () => <Ico d={<><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></>}/>;
const ClickIcon    = () => <Ico d={<><path d="M9 9l2 12 1.8-5.2L18 14z"/><path d="M9 9H3"/><path d="M9 9V3"/></>}/>;
const EyeIcon      = () => <Ico d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}/>;
const MaskIcon     = () => <Ico d={<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M2 10h20" strokeDasharray="3 3"/></>}/>;
const GrayscaleIcon= () => <Ico d={<><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor" stroke="none"/></>}/>;

const ROWS = [
  [KeyboardIcon,  "Modo teclado (voz por Tab)", "keyboard"],
  [ClickIcon,     "Clic y escuchar",             "clickListen"],
  [EyeIcon,       "Visibilidad de texto",         "textVis"],
  [MaskIcon,      "Máscara de página",            "pageMask"],
  [GrayscaleIcon, "Escala de grises",             "grayscale"],
];

export default function PrefsPanel({ prefs, onChange, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => { panelRef.current?.querySelector("button,input")?.focus(); }, []);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="ed-a11y-panel" ref={panelRef} role="dialog" aria-modal="false" aria-label="Preferencias de accesibilidad">
      <div className="ed-a11y-panel-head">
        <span className="ed-a11y-panel-title">Accesibilidad</span>
        <button className="ed-a11y-panel-close" onClick={onClose} aria-label="Cerrar">
          <CloseIcon/>
        </button>
      </div>
      <div className="ed-a11y-panel-body">
        {ROWS.map(([Icon, label, key]) => (
          <label key={key} className="ed-a11y-toggle" htmlFor={`ed-ao-${key}`}>
            <span className="ed-a11y-item-label"><Icon/>{label}</span>
            <span className="rs-toggle-track" aria-hidden="true">
              <input
                id={`ed-ao-${key}`}
                type="checkbox"
                checked={!!prefs[key]}
                onChange={e => onChange(key, e.target.checked)}
                className="rs-toggle-input"
                role="switch"
                aria-checked={!!prefs[key]}
              />
              <span className="rs-toggle-thumb"/>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
