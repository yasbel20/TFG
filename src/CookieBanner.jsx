import { useState, useEffect } from "react";

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
      <style>{css}</style>

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

const css = `
  /* ── Barra inferior ── */
  .ck-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 9800;
    background: #fff;
    border-top: 1px solid #e5e7eb;
    box-shadow: 0 -4px 24px rgba(0,0,0,.08);
    animation: ck-slide-up .2s ease;
  }
  @keyframes ck-slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  .ck-bar-inner {
    max-width: 1160px;
    margin: 0 auto;
    padding: 1rem clamp(1rem, 4vw, 3rem);
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .ck-bar-text {
    flex: 1;
    font-family: 'Inter', sans-serif;
    font-size: .83rem;
    color: #374151;
    line-height: 1.6;
    min-width: 240px;
  }
  .ck-bar-brand {
    color: #111;
    font-weight: 700;
  }
  .ck-inline-link {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: .83rem;
    color: #3d47c8;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .ck-inline-link:hover { color: #2f39a8; }
  .ck-bar-actions {
    display: flex;
    gap: .6rem;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  /* ── Botones compartidos ── */
  .ck-btn {
    font-family: 'Inter', sans-serif;
    font-size: .82rem;
    font-weight: 600;
    padding: .5rem 1.1rem;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
    transition: background .12s, color .12s, border-color .12s;
  }
  .ck-btn--outline {
    background: #fff;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  .ck-btn--outline:hover { background: #f9fafb; border-color: #9ca3af; }
  .ck-btn--ghost {
    background: #f3f4f6;
    color: #111;
    border: 1px solid transparent;
  }
  .ck-btn--ghost:hover { background: #e5e7eb; }
  .ck-btn--solid {
    background: #3d47c8;
    color: #fff;
    border: 1px solid transparent;
  }
  .ck-btn--solid:hover { background: #2f39a8; }

  /* ── Modal ── */
  .ck-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.45);
    z-index: 9850;
  }
  .ck-modal {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9900;
    background: #fff;
    width: min(540px, calc(100vw - 2rem));
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    border-radius: 4px;
    box-shadow: 0 20px 60px rgba(0,0,0,.2);
    display: flex;
    flex-direction: column;
    animation: ck-fade-in .18s ease;
  }
  @keyframes ck-fade-in {
    from { opacity:0; transform:translate(-50%,-48%); }
    to   { opacity:1; transform:translate(-50%,-50%); }
  }
  .ck-modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 1rem;
    border-bottom: 1px solid #f3f4f6;
    position: sticky; top: 0;
    background: #fff;
  }
  .ck-modal-title {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #111;
    margin: 0;
  }
  .ck-modal-close {
    background: none; border: none; cursor: pointer;
    color: #9ca3af; padding: .25rem;
    display: flex; align-items: center;
    border-radius: 4px;
    transition: color .12s;
  }
  .ck-modal-close:hover { color: #111; }

  .ck-modal-body {
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 1;
  }
  .ck-modal-intro {
    font-family: 'Inter', sans-serif;
    font-size: .83rem;
    color: #6b7280;
    line-height: 1.65;
    margin: 0 0 1.25rem;
  }

  /* Filas de categoría */
  .ck-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1rem 0;
  }
  .ck-row-info { flex: 1; }
  .ck-row-name {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: .88rem;
    font-weight: 600;
    color: #111;
    margin-bottom: .4rem;
  }
  .ck-row-desc {
    font-family: 'Inter', sans-serif;
    font-size: .78rem;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }
  .ck-always-label {
    font-family: 'Inter', sans-serif;
    font-size: .75rem;
    font-weight: 600;
    color: #16a34a;
    white-space: nowrap;
  }
  .ck-divider {
    height: 1px;
    background: #f3f4f6;
  }

  /* Toggle switch */
  .ck-toggle {
    display: flex;
    align-items: center;
    gap: .5rem;
    cursor: pointer;
    flex-shrink: 0;
  }
  .ck-toggle input {
    position: absolute;
    opacity: 0; width: 0; height: 0;
  }
  .ck-toggle-track {
    position: relative;
    width: 40px; height: 22px;
    background: #d1d5db;
    border-radius: 11px;
    transition: background .2s;
    flex-shrink: 0;
  }
  .ck-toggle input:checked + .ck-toggle-track { background: #3d47c8; }
  .ck-toggle-thumb {
    position: absolute;
    top: 3px; left: 3px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,.2);
    transition: left .2s;
  }
  .ck-toggle input:checked ~ .ck-toggle-track .ck-toggle-thumb,
  .ck-toggle input:checked + .ck-toggle-track .ck-toggle-thumb { left: 21px; }
  .ck-sr-only {
    position: absolute; width:1px; height:1px;
    padding:0; margin:-1px; overflow:hidden;
    clip:rect(0,0,0,0); border:0;
  }

  .ck-modal-foot {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: .6rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid #f3f4f6;
    background: #fafafa;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    .ck-bar-actions { width: 100%; }
    .ck-btn { flex: 1; text-align: center; }
    .ck-modal-foot { justify-content: stretch; }
    .ck-modal-foot .ck-btn { flex: 1; }
  }
`;
