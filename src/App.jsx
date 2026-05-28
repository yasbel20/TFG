import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { AccessibilityProvider } from "./AccessibilityContext";
import AccessibilityOverlay from "./AccessibilityOverlay";
import INCLUGOHome from "./home";
import EventsPage from "./EventsPage";
import AgendaPage from "./AgendaPage";
import EventDetailPage from "./EventDetailPage";
import PerfilPage from "./PerfilPage";
import WelcomeSplash from "./WelcomeSplash";
import Footer from "./Footer";

function GlobalUI() {
  const { pathname } = useLocation();
  const isDetail = pathname.startsWith("/evento/");
  return (
    <>
      <Footer />
      {!isDetail && <AccessibilityOverlay />}
    </>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App
