import { useState, useEffect } from "react";

const CLASS = "hi-contrast";

export default function HighContrastToggle() {
  const [active, setActive] = useState(() => localStorage.getItem(CLASS) === "1");

  useEffect(() => {
    document.body.classList.toggle(CLASS, active);
    localStorage.setItem(CLASS, active ? "1" : "0");
  }, [active]);

  return (
    <button
      className={`hc-btn${active ? " hc-btn--on" : ""}`}
      onClick={() => setActive(a => !a)}
      aria-pressed={active}
      aria-label={active ? "Desactivar alto contraste" : "Activar alto contraste"}
      title={active ? "Desactivar alto contraste" : "Activar alto contraste"}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor" stroke="none"/>
      </svg>
    </button>
  );
}
