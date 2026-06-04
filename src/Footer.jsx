import { useNavigate } from "react-router-dom";
import "./Footer.css";

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
    <footer className="ft-footer">

      <div className="ft-top">
        <div className="ft-cols">

          <div className="ft-col">
            <p className="ft-col-title">Explorar</p>
            <ul className="ft-list">
              <li><button className="ft-lnk" onClick={() => navigate("/eventos")}>Todos los eventos</button></li>
              <li><button className="ft-lnk" onClick={() => navigate("/eventos/musica")}>Música</button></li>
              <li><button className="ft-lnk" onClick={() => navigate("/eventos/teatro")}>Teatro</button></li>
              <li><button className="ft-lnk" onClick={() => navigate("/eventos/exposicion")}>Exposiciones</button></li>
              <li><button className="ft-lnk" onClick={() => navigate("/eventos/cine")}>Cine</button></li>
              <li><button className="ft-lnk" onClick={() => navigate("/eventos/danza")}>Danza</button></li>
              <li><button className="ft-lnk" onClick={() => navigate("/eventos/cultura")}>Cultura</button></li>
              <li><button className="ft-lnk" onClick={() => navigate("/agenda")}>Agenda</button></li>
            </ul>
          </div>

          <div className="ft-col">
            <p className="ft-col-title">Descubre</p>
            <ul className="ft-list">
              <li><button className="ft-lnk" onClick={() => scrollToSection("how-heading")}>Cómo funciona</button></li>
              <li><button className="ft-lnk" onClick={() => scrollToSection("access-heading")}>Accesibilidad</button></li>
              <li><button className="ft-lnk" onClick={() => navigate("/perfil")}>Mi cuenta</button></li>
            </ul>
          </div>

          <div className="ft-col">
            <p className="ft-col-title">Soporte</p>
            <ul className="ft-list">
              <li><button className="ft-lnk" onClick={() => scrollToSection("faq-heading")}>Preguntas frecuentes</button></li>
              <li><button className="ft-lnk" onClick={() => scrollToSection("tools-heading")}>Herramientas de accesibilidad</button></li>
            </ul>
          </div>

          <div className="ft-col">
            <p className="ft-col-title">Legal</p>
            <ul className="ft-list">
              <li><button className="ft-lnk">Política de privacidad</button></li>
              <li><button className="ft-lnk">Política de cookies</button></li>
              <li><button className="ft-lnk">Aviso legal</button></li>
            </ul>
          </div>

        </div>

        <div className="ft-divider" aria-hidden="true" />

        <div className="ft-brand">
          <button className="ft-logo-btn" onClick={() => navigate("/")} aria-label="INCLUGO — ir al inicio">
            <img src="/img/InclugoLogo/LogoClaro.png" className="ft-logo ft-logo--light" alt="INCLUGO" />
            <img src="/img/InclugoLogo/LogoOscuro.png" className="ft-logo ft-logo--dark"  alt="INCLUGO" />
          </button>
        </div>
      </div>

      <div className="ft-bottom">
        <span className="ft-copy">© {year} INCLUGO — Cultura accesible en Madrid</span>
      </div>

    </footer>
  );
}
