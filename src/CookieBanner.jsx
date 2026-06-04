import { useState, useEffect } from "react";
import "./CookieBanner.css";

const CONSENT_KEY = "inclugo_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible]   = useState(false);
  const [modal, setModal]       = useState(false);
  const [prefPref, setPrefPref] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  const save = (level) => {
    localStorage.setItem(CONSENT_KEY, level);
    if (level === "essential") localStorage.removeItem("inclugo_a11y_prefs");
    setVisible(false);
    setModal(false);
  };

  const saveCustom = () => save(prefPref ? "all" : "essential");

  if (!visible) return null;

  return (
    <>

      {/* ── Barra inferior ── */}
      {!modal && (
        <div className="ck-bar" role="region" aria-label="Aviso de cookies">
          <div className="ck-bar-inner">
            <div className="ck-bar-text">
              <strong className="ck-bar-brand">INCLUGO</strong> utiliza cookies propias para mantener tu sesión y recordar tus preferencias de accesibilidad entre visitas. No compartimos datos con terceros.{" "}
              <button className="ck-inline-link" onClick={() => setModal(true)}>
                Gestionar preferencias
              </button>
            </div>
            <div className="ck-bar-actions">
              <button className="ck-btn ck-btn--outline" onClick={() => save("essential")}>
                Rechazar no esenciales
              </button>
              <button className="ck-btn ck-btn--solid" onClick={() => save("all")}>
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de personalización ── */}
      {modal && (
        <>
          <div className="ck-overlay" aria-hidden="true" onClick={() => setModal(false)}/>
          <div className="ck-modal" role="dialog" aria-modal="true" aria-labelledby="ck-modal-title">
            <div className="ck-modal-head">
              <h2 id="ck-modal-title" className="ck-modal-title">Centro de preferencias de privacidad</h2>
              <button className="ck-modal-close" onClick={() => setModal(false)} aria-label="Cerrar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="ck-modal-body">
              <p className="ck-modal-intro">
                INCLUGO es una plataforma de cultura accesible para Madrid. Al usarla, guardamos información mínima en tu navegador para que todo funcione bien. Aquí puedes ver exactamente para qué sirve cada tipo y decidir qué aceptas.
              </p>

              {/* Técnicas */}
              <div className="ck-row">
                <div className="ck-row-info">
                  <span className="ck-row-name">Cookies técnicas y de sesión</span>
                  <p className="ck-row-desc">
                    Son las que hacen que la web funcione. Cuando inicias sesión, guardamos un pequeño dato en tu navegador para que no tengas que volver a introducir tu contraseña cada vez que cambias de página. También usamos una cookie de seguridad que protege tus acciones dentro de la plataforma frente a accesos no autorizados. Sin estas cookies la web no puede funcionar, por eso no se pueden desactivar.
                  </p>
                </div>
                <div className="ck-toggle-wrap ck-toggle-wrap--disabled" aria-label="Siempre activas">
                  <span className="ck-always-label">Siempre activas</span>
                </div>
              </div>

              <div className="ck-divider"/>

              {/* Preferencias */}
              <div className="ck-row">
                <div className="ck-row-info">
                  <span className="ck-row-name">Preferencias de accesibilidad</span>
                  <p className="ck-row-desc">
                    Si activas herramientas como el modo teclado con voz, la escala de grises, el clic para escuchar o la máscara de foco, guardamos esa elección en tu navegador. Así la próxima vez que entres ya estarán activadas sin que tengas que configurarlas de nuevo. Si rechazas esta opción, las herramientas seguirán funcionando durante tu visita, pero no se recordarán.
                  </p>
                </div>
                <label className="ck-toggle" htmlFor="ck-pref-toggle">
                  <input
                    id="ck-pref-toggle"
                    type="checkbox"
                    checked={prefPref}
                    onChange={e => setPrefPref(e.target.checked)}
                    role="switch"
                    aria-checked={prefPref}
                  />
                  <span className="ck-toggle-track" aria-hidden="true">
                    <span className="ck-toggle-thumb"/>
                  </span>
                  <span className="ck-sr-only">{prefPref ? "Activado" : "Desactivado"}</span>
                </label>
              </div>
            </div>

            <div className="ck-modal-foot">
              <button className="ck-btn ck-btn--outline" onClick={() => save("essential")}>
                Rechazar no esenciales
              </button>
              <button className="ck-btn ck-btn--ghost" onClick={saveCustom}>
                Guardar preferencias
              </button>
              <button className="ck-btn ck-btn--solid" onClick={() => save("all")}>
                Aceptar todas
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

