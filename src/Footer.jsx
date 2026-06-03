import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const scrollToSection = (id) => {
    navigate("/");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <footer style={s.footer}>

      {/* ── Top section ── */}
      <div style={s.top}>

        <div style={s.cols}>

          <div style={s.col}>
            <p style={s.colTitle}>Explorar</p>
            <ul style={s.list}>
              <li><button style={s.lnk} onClick={() => navigate("/eventos")}>Todos los eventos</button></li>
              <li><button style={s.lnk} onClick={() => navigate("/eventos/musica")}>Música</button></li>
              <li><button style={s.lnk} onClick={() => navigate("/eventos/teatro")}>Teatro</button></li>
              <li><button style={s.lnk} onClick={() => navigate("/eventos/exposicion")}>Exposiciones</button></li>
              <li><button style={s.lnk} onClick={() => navigate("/eventos/cine")}>Cine</button></li>
              <li><button style={s.lnk} onClick={() => navigate("/eventos/danza")}>Danza</button></li>
              <li><button style={s.lnk} onClick={() => navigate("/eventos/cultura")}>Cultura</button></li>
              <li><button style={s.lnk} onClick={() => navigate("/agenda")}>Agenda</button></li>
            </ul>
          </div>

          <div style={s.col}>
            <p style={s.colTitle}>Descubre</p>
            <ul style={s.list}>
              <li><button style={s.lnk} onClick={() => scrollToSection("how-heading")}>Cómo funciona</button></li>
              <li><button style={s.lnk} onClick={() => scrollToSection("access-heading")}>Accesibilidad</button></li>
              <li><button style={s.lnk} onClick={() => navigate("/perfil")}>Mi cuenta</button></li>
            </ul>
          </div>

          <div style={s.col}>
            <p style={s.colTitle}>Soporte</p>
            <ul style={s.list}>
              <li><button style={s.lnk} onClick={() => scrollToSection("faq-heading")}>Preguntas frecuentes</button></li>
              <li><button style={s.lnk} onClick={() => scrollToSection("tools-heading")}>Herramientas de accesibilidad</button></li>
            </ul>
          </div>

          <div style={s.col}>
            <p style={s.colTitle}>Legal</p>
            <ul style={s.list}>
              <li><button style={s.lnk}>Política de privacidad</button></li>
              <li><button style={s.lnk}>Política de cookies</button></li>
              <li><button style={s.lnk}>Aviso legal</button></li>
            </ul>
          </div>

        </div>

        <div style={s.vDivider} aria-hidden="true" />

        <div style={s.brand}>
          <button style={s.logoBtn} onClick={() => navigate("/")} aria-label="INCLUGO — ir al inicio">
            <img src="/img/InclugoLogo/LogoClaro.png" className="ft-logo ft-logo--light" alt="INCLUGO" style={s.logo} />
            <img src="/img/InclugoLogo/LogoOscuro.png" className="ft-logo ft-logo--dark"  alt="INCLUGO" style={{...s.logo, display:"none"}} />
          </button>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div style={s.bottom}>
        <span style={s.copy}>© {year} INCLUGO — Cultura accesible en Madrid</span>
      </div>

      <style>{css}</style>
    </footer>
  );
}

const s = {
  footer:    { width: "100%", background: "var(--bg)", borderTop: "1px solid var(--border)", marginTop: "auto" },
  top:       { width: "100%", padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,5vw,6rem)", display: "flex", gap: "clamp(2rem,5vw,4rem)", alignItems: "flex-start" },
  brand:     { display: "flex", flexDirection: "column", flexShrink: 0, marginLeft: "auto" },
  logoBtn:   { background: "none", border: "none", cursor: "pointer", padding: 0, alignSelf: "flex-start" },
  logo:      { height: "clamp(80px,10vw,140px)", width: "auto" },
  vDivider:  { width: "1px", alignSelf: "stretch", background: "var(--border)", flexShrink: 0 },
  cols:      { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(1.5rem,4vw,3rem)", flex: 1 },
  col:       { display: "flex", flexDirection: "column", gap: ".75rem" },
  colTitle:  { fontFamily: "var(--ff-b)", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text-muted)", margin: 0, marginBottom: ".25rem" },
  list:      { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: ".35rem" },
  lnk:       { background: "none", border: "none", cursor: "pointer", fontFamily: "var(--ff-b)", fontSize: ".88rem", color: "var(--text-secondary)", padding: 0, textAlign: "left", transition: "color .15s" },
  bottom:    { borderTop: "1px solid var(--border)", padding: "1rem clamp(1.25rem,5vw,6rem)", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: ".5rem", alignItems: "center" },
  copy:      { fontFamily: "var(--ff-b)", fontSize: ".72rem", color: "var(--text-muted)", letterSpacing: ".04em" },
  copyLink:  { color: "var(--brand)", textDecoration: "none", fontWeight: 600 },
};

const css = `
  footer button:hover { color: var(--brand) !important; }

  .hi-contrast .ft-logo--light { display: none !important; }
  .hi-contrast .ft-logo--dark  { display: block !important; }

  @media (max-width: 1024px) {
    footer > div:first-of-type > div:first-child {
      grid-template-columns: repeat(2,1fr) !important;
    }
  }

  @media (max-width: 768px) {
    footer > div:first-of-type {
      flex-direction: column !important;
    }
    footer > div:first-of-type > div[style*="width: 1px"] {
      display: none !important;
    }
  }

  @media (max-width: 480px) {
    footer > div:first-of-type > div:first-child {
      grid-template-columns: 1fr !important;
    }
  }
`;
