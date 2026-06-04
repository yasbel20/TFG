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
    <AccessibilityProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          {/* hc-wrap recibe el filtro de alto contraste — los elementos fixed fuera de él mantienen position:fixed correcto */}
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
