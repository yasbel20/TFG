import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./AuthContext";
import { AccessibilityProvider } from "./AccessibilityContext";
import AccessibilityOverlay from "./AccessibilityOverlay";
import CookieBanner from "./CookieBanner";
import INCLUGOHome from "./HomePage";
import EventsPage from "./EventsPage";
import AgendaPage from "./AgendaPage";
import EventDetailPage from "./EventDetailPage";
import PerfilPage from "./PerfilPage";
import WelcomeSplash from "./WelcomeSplash";
import Footer from "./Footer";
import { setupReveal, updateReveal } from "./reveal";

// Vuelve al top y reactiva las animaciones reveal en cada cambio de ruta
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(updateReveal, 50);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => setupReveal(), []);
  return (
    // AccessibilityProvider fuera de AuthProvider: las herramientas de accesibilidad
    // funcionan aunque no haya sesión iniciada
    <AccessibilityProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          {/* Skip link WCAG 2.4.1: permite saltar la nav con teclado */}
          <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
          {/* hc-wrap recibe el filtro CSS de alto contraste — los elementos
              position:fixed (panel accesibilidad) quedan fuera y se ven correctamente */}
          <div id="hc-wrap">
            <Routes>
              <Route path="/"             element={<INCLUGOHome />} />
              <Route path="/eventos"      element={<EventsPage />} />
              <Route path="/eventos/:cat" element={<EventsPage />} />
              <Route path="/agenda"       element={<AgendaPage />} />
              <Route path="/evento/:id"   element={<EventDetailPage />} />
              <Route path="/perfil"       element={<PerfilPage />} />
              <Route path="/bienvenida"   element={<WelcomeSplash />} />
            </Routes>
            <Footer />
          </div>
          <AccessibilityOverlay />
          <CookieBanner />
        </BrowserRouter>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App
