import { useState, useEffect } from "react";
import { useAccessibility } from "./AccessibilityContext";
import "./AccessibilityOverlay.css";

const Ico = ({ d, size = 16, fill = "none", stroke = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {typeof d === "string" ? <path d={d}/> : d}
  </svg>
);

const A11yIcon    = () => <Ico size={30} d={<><circle cx="12" cy="4" r="2"/><path d="M12 6v6l3 3M12 6l-3 6M6 8h12"/></>}/>;
const CloseIcon   = () => <Ico d="M18 6 6 18M6 6l12 12"/>;
const KeyboardIcon= () => <Ico d={<><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></>}/>;
const ClickIcon   = () => <Ico d={<><path d="M9 9l2 12 1.8-5.2L18 14z"/><path d="M9 9H3"/><path d="M9 9V3"/></>}/>;
const EyeIcon     = () => <Ico d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}/>;
const MaskIcon      = () => <Ico d={<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M2 10h20" strokeDasharray="3 3"/></>}/>
const GrayscaleIcon = () => <Ico d={<><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor" stroke="none"/></>}/>;

function Toggle({ id, checked, onChange, label }) {
  return (
    <label className="ao-toggle" htmlFor={id}>
      <span className="ao-toggle-label">{label}</span>
      <span className="ao-toggle-track" aria-hidden="true">
        <input id={id} type="checkbox" checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="ao-toggle-input" role="switch" aria-checked={checked}/>
        <span className="ao-toggle-thumb"/>
      </span>
    </label>
  );
}

export default function AccessibilityOverlay() {
  const { prefs, updatePref, overlayOpen: open, setOverlayOpen: setOpen } = useAccessibility();

  const item = (Icon, label, key) => (
    <Toggle
      key={key}
      id={`ao-${key}`}
      checked={!!prefs[key]}
      onChange={v => updatePref(key, v)}
      label={<span className="ao-item-label"><Icon/>{label}</span>}
    />
  );

  return (
    <>

      <button
        className={`ao-fab${open ? " ao-fab--open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Preferencias de accesibilidad"
        aria-expanded={open}
      >
        {open ? <CloseIcon/> : <A11yIcon/>}
      </button>

      {open && (
        <div className="ao-panel" role="dialog" aria-modal="false" aria-label="Preferencias de accesibilidad">
          <div className="ao-panel-head">
            <span className="ao-panel-title">Accesibilidad</span>
            <button className="ao-panel-close" onClick={() => setOpen(false)} aria-label="Cerrar">
              <CloseIcon/>
            </button>
          </div>
          <div className="ao-panel-body">
            {item(KeyboardIcon,   "Modo teclado (voz por Tab)", "keyboard")}
            {item(ClickIcon,    "Clic y escuchar",             "clickListen")}
            {item(EyeIcon,      "Visibilidad de texto",        "textVis")}
            {item(MaskIcon,     "Máscara de página",           "pageMask")}
            {item(GrayscaleIcon,"Escala de grises",            "grayscale")}
          </div>
        </div>
      )}

      {prefs.pageMask && <PageMask/>}
    </>
  );
}

function PageMask() {
  const [y, setY] = useState(120);

  useEffect(() => {
    const handler = e => setY(e.clientY);
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      className="ao-mask"
      style={{ "--mask-y": `${y}px` }}
      aria-hidden="true"
    />
  );
}

