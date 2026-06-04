import { useState, useRef, useEffect } from "react";

const TOOLS_ITEMS = [
  {
    key: "tab",
    video: "/img/eventos/case/TAB1.mp4",
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
    video: "/img/eventos/case/ESCUCHAR.mp4",
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
    video: "/img/eventos/case/VISIBILIDAD1.mp4",
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
    video: "/img/eventos/case/MASCARA1.mp4",
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
    video: "/img/eventos/case/ESCALA1.mp4",
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
  const [active, setActive] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [active]);

  const item = TOOLS_ITEMS[active];

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
          <video
            ref={videoRef}
            key={item.video}
            className="ts-video"
            src={item.video}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </div>
  );
}
