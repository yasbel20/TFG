import { useState } from "react";
import { useAccessibility } from "./AccessibilityContext";

const Ico = ({ d, size = 16, fill = "none", stroke = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {typeof d === "string" ? <path d={d}/> : d}
  </svg>
);

const A11yIcon    = () => <Ico size={22} d={<><circle cx="12" cy="4" r="2"/><path d="M12 6v6l3 3M12 6l-3 6M6 8h12"/></>}/>;
const CloseIcon   = () => <Ico d="M18 6 6 18M6 6l12 12"/>;
const KeyboardIcon= () => <Ico d={<><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></>}/>;
const ClickIcon   = () => <Ico d={<><path d="M9 9l2 12 1.8-5.2L18 14z"/><path d="M9 9H3"/><path d="M9 9V3"/></>}/>;
const EyeIcon     = () => <Ico d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}/>;
const MaskIcon    = () => <Ico d={<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M2 10h20" strokeDasharray="3 3"/></>}/>;

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
  const [open, setOpen] = useState(false);
  const { prefs, updatePref } = useAccessibility();

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
      <style>{css}</style>

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
            {item(KeyboardIcon, "Modo teclado (voz por Tab)", "keyboard")}
            {item(ClickIcon,    "Clic y escuchar",             "clickListen")}
            {item(EyeIcon,      "Visibilidad de texto",        "textVis")}
            {item(MaskIcon,     "Máscara de página",           "pageMask")}
          </div>
          <div className="ao-panel-foot">por <strong>INCLUGO</strong> · accesibilidad web</div>
        </div>
      )}

      {prefs.pageMask && <PageMask/>}
    </>
  );
}

function PageMask() {
  const [y, setY] = useState(120);
  return (
    <div
      className="ao-mask"
      style={{ "--mask-y": `${y}px` }}
      onMouseMove={e => setY(e.clientY)}
      aria-hidden="true"
    />
  );
}

const css = `
  .ao-fab {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9100;
    width: 48px; height: 48px;
    border-radius: 50%;
    background: var(--brand, #3d47c8);
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(61,71,200,.35);
    transition: background .15s, transform .15s;
  }
  .ao-fab:hover { background: var(--brand-hover, #2f39a8); transform: scale(1.07); }
  .ao-fab--open { background: var(--text-primary, #111); }

  .ao-panel {
    position: fixed;
    bottom: 5.5rem;
    right: 1.5rem;
    z-index: 9100;
    width: 280px;
    background: var(--bg, #fff);
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0,0,0,.13);
    overflow: hidden;
    animation: ao-in .15s ease;
  }
  @keyframes ao-in {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .ao-panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: .75rem 1rem;
    border-bottom: 1px solid var(--border, #e5e7eb);
  }
  .ao-panel-title {
    font-family: var(--ff-h, sans-serif);
    font-size: 1rem; font-weight: 700; letter-spacing: .04em;
    color: var(--text-primary, #111);
  }
  .ao-panel-close {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted, #6b7280); padding: .25rem;
    display: flex; align-items: center; justify-content: center;
    border-radius: 4px;
  }
  .ao-panel-close:hover { color: var(--text-primary, #111); }

  .ao-panel-body {
    display: flex; flex-direction: column; gap: .1rem;
    padding: .5rem 0;
  }

  .ao-toggle {
    display: flex; align-items: center; justify-content: space-between;
    padding: .55rem 1rem;
    cursor: pointer;
    transition: background .12s;
  }
  .ao-toggle:hover { background: var(--bg-surface, #f9fafb); }
  .ao-item-label {
    display: flex; align-items: center; gap: .5rem;
    font-family: var(--ff-b, sans-serif);
    font-size: .87rem; color: var(--text-secondary, #374151);
  }
  .ao-toggle-track {
    position: relative; width: 38px; height: 22px;
    background: var(--border, #d1d5db); border-radius: 11px;
    flex-shrink: 0; transition: background .2s;
  }
  .ao-toggle-input {
    position: absolute; opacity: 0; width: 0; height: 0;
  }
  .ao-toggle-input:checked + .ao-toggle-thumb { left: 18px; }
  .ao-toggle-input:checked ~ * { --checked: 1; }
  .ao-toggle:has(.ao-toggle-input:checked) .ao-toggle-track { background: var(--brand, #3d47c8); }
  .ao-toggle-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%;
    background: #fff; transition: left .2s;
    box-shadow: 0 1px 4px rgba(0,0,0,.2);
  }

  .ao-panel-foot {
    padding: .5rem 1rem;
    font-size: .72rem; color: var(--text-muted, #9ca3af);
    border-top: 1px solid var(--border, #e5e7eb);
    text-align: center;
  }

  /* Máscara de página */
  .ao-mask {
    position: fixed; inset: 0; z-index: 9050; pointer-events: none;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,.7) 0,
      rgba(0,0,0,.7) calc(var(--mask-y) - 28px),
      transparent    calc(var(--mask-y) - 28px),
      transparent    calc(var(--mask-y) + 28px),
      rgba(0,0,0,.7) calc(var(--mask-y) + 28px)
    );
  }

  /* Visibilidad de texto global */
  body.a11y-text-vis * {
    letter-spacing: .04em !important;
    line-height: 1.75 !important;
    word-spacing: .08em !important;
  }
`;
