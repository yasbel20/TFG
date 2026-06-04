import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAccessibility } from "../../AccessibilityContext";

export default function FloatingHelper() {
  const { setOverlayOpen } = useAccessibility();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
        timerRef.current = setTimeout(() => setVisible(false), 10000);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  const dismiss = (e) => {
    e.stopPropagation();
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  return createPortal(
    <div
      className="gh-wrap"
      role="button"
      tabIndex={0}
      aria-label="Abrir funciones de accesibilidad"
      onClick={() => setOverlayOpen(true)}
      onKeyDown={e => e.key === "Enter" && setOverlayOpen(true)}
    >
      <div className="gh-bubble">
        <button className="gh-dismiss" onClick={dismiss} aria-label="Cerrar sugerencia">×</button>
        <strong className="gh-bubble-title">¿Necesitas ayuda?</strong>
        <p className="gh-bubble-text">Haz clic aquí para acceder a las funciones de accesibilidad.</p>
        <span className="gh-bubble-cta">
          Estamos aquí para ti&nbsp;
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{display:"inline", verticalAlign:"middle"}}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </span>
        <span className="gh-bubble-tip" aria-hidden="true"/>
      </div>

      <div className="gh-mascot">
        <img src="/img/personaje1.png" alt="" className="gh-img" aria-hidden="true"/>
        <svg className="gh-arrow" width="50" height="44" viewBox="0 0 50 44" fill="none" aria-hidden="true">
          <path d="M10 6 C 14 20, 30 28, 40 38" stroke="#3d47c8" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M33 36 L41 40 L38 31" stroke="#3d47c8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>,
    document.body
  );
}
