import { useState, useRef, useEffect } from "react";

const TOOLS_ITEMS = [
  {
    key: "tab",
    videoClaro:  "/ShowCase/TABClaro.mp4",
    videoOscuro: "/ShowCase/TABoscuro.mp4",
    label: "Modo teclado",
    desc: "Navega sin ratón. Usa la tecla Tab para recorrer la web y activar la lectura de voz integrada.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>
      </svg>
    ),
  },
  {
    key: "clic",
    videoClaro:  "/ShowCase/CLICclaro.mp4",
    videoOscuro: "/ShowCase/CLICoscuro.mp4",
    label: "Clic y escuchar",
    desc: "Escucha el contenido. Pulsa sobre cualquier texto y escúchalo en voz alta al instante.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 9l2 12 1.8-5.2L18 14z"/>
        <path d="M9 9H3M9 9V3"/>
      </svg>
    ),
  },
  {
    key: "visibilidad",
    videoClaro:  "/ShowCase/VISIBILIDADclaro.mp4",
    videoOscuro: "/ShowCase/VISIBILIDADoscuro.mp4",
    label: "Texto visible",
    desc: "Lectura cómoda. Modifica el tamaño y espaciado de las letras para evitar la fatiga visual.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    key: "mascara",
    videoClaro:  "/ShowCase/FOCOclaro.mp4",
    videoOscuro: "/ShowCase/FOCOoscuro.mp4",
    label: "Máscara de foco",
    desc: "Evita distracciones. Crea una banda de enfoque que resalta solo la línea que estás leyendo.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4M2 10h20" strokeDasharray="3 3"/>
      </svg>
    ),
  },
  {
    key: "escala",
    videoClaro:  "/ShowCase/GRISESclaro.mp4",
    videoOscuro: "/ShowCase/GRISESoscuro.mp4",
    label: "Escala de grises",
    desc: "Contraste visual. Elimina las distracciones de color convirtiendo la interfaz a tonos de gris.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a10 10 0 0 1 0 20M2 12h20"/>
      </svg>
    ),
  },
];

export default function ToolsShowcase() {
  const [active, setActive]         = useState(0);
  const [hiContrast, setHiContrast] = useState(() =>
    document.body.classList.contains("hi-contrast")
  );
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  // Detecta cambios de alto contraste observando la clase del body
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setHiContrast(document.body.classList.contains("hi-contrast"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Recarga y reproduce el vídeo al cambiar de herramienta o de modo de contraste
  // Al cambiar de herramienta vuelve a mutear para no sorprender al usuario con audio
  useEffect(() => {
    setMuted(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [active, hiContrast]);

  const item = TOOLS_ITEMS[active];
  const videoSrc = hiContrast ? item.videoOscuro : item.videoClaro;
  const hasAudio = item.key === "clic";

  return (
    <div className="ts-outer">
      <div className="ts-header">
        <p className="sec-eyebrow">Diseño inclusivo</p>
        <h2 id="tools-heading" className="tools-heading">
          LA WEB<br/>
          <span className="hl">QUE SE ADAPTA A TI</span><br/>
        </h2>
      </div>

      <div className="ts-wrap">
        <ul className="ts-list" role="list">
          {TOOLS_ITEMS.map((t, i) => (
            <li key={t.key}>
              <button
                className={`ts-item${active === i ? " ts-item--active" : ""}`}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
              >
                <span className="ts-item-icon">{t.icon}</span>
                <span className="ts-item-text">
                  <span className="ts-item-label">{t.label}</span>
                  <span className="ts-item-desc">{t.desc}</span>
                </span>
                <span className="ts-item-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="ts-right" aria-hidden="true">
          {videoSrc ? (
            <div className="ts-video-wrap">
              <video
                ref={videoRef}
                key={videoSrc}
                className="ts-video"
                src={videoSrc}
                autoPlay
                loop
                muted={muted}
                playsInline
              />
              {hasAudio && (
                <button
                  className={`ts-unmute-btn${!muted ? " ts-unmute-btn--on" : ""}`}
                  onClick={() => setMuted(m => !m)}
                  aria-label={muted ? "Activar sonido" : "Silenciar"}
                  aria-hidden="false"
                >
                  {muted ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <line x1="23" y1="9" x2="17" y2="15"/>
                      <line x1="17" y1="9" x2="23" y2="15"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                  )}
                  <span className="ts-unmute-label">{muted ? "Activar sonido" : "Silenciar"}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="ts-video-placeholder">
              <span className="ts-placeholder-icon">{item.icon}</span>
              <span className="ts-placeholder-text">{item.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
