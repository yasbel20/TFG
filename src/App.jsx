import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./AuthContext";
import { AccessibilityProvider } from "./AccessibilityContext";
import AccessibilityOverlay from "./AccessibilityOverlay";
import CookieBanner from "./CookieBanner";
import INCLUGOHome from "./home";
import EventsPage from "./EventsPage";
import AgendaPage from "./AgendaPage";
import EventDetailPage from "./EventDetailPage";
import PerfilPage from "./PerfilPage";
import WelcomeSplash from "./WelcomeSplash";
import Footer from "./Footer";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function GlobalUI() {
  const { pathname } = useLocation();
  const hasOwnOverlay = pathname.startsWith("/evento/") ||
                        pathname.startsWith("/eventos");
  return (
    <>
      <Footer />
      {!hasOwnOverlay && <AccessibilityOverlay />}
    </>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/"             element={<INCLUGOHome />} />
            <Route path="/eventos"      element={<EventsPage />} />
            <Route path="/eventos/:cat" element={<EventsPage />} />
            <Route path="/agenda"       element={<AgendaPage />} />
            <Route path="/evento/:id"   element={<EventDetailPage />} />
            <Route path="/perfil"       element={<PerfilPage />} />
            <Route path="/bienvenida"   element={<WelcomeSplash />} />
          </Routes>
          <GlobalUI />
          <CookieBanner />
        </BrowserRouter>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App
