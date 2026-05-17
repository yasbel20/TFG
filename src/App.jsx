import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import INCLUGOHome from "./home";
import EventsPage from "./EventsPage";
import AgendaPage from "./AgendaPage";
import EventDetailPage from "./EventDetailPage";
import PerfilPage from "./PerfilPage";
import WelcomeSplash from "./WelcomeSplash";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"             element={<INCLUGOHome />} />
          <Route path="/eventos"      element={<EventsPage />} />
          <Route path="/eventos/:cat" element={<EventsPage />} />
          <Route path="/agenda"       element={<AgendaPage />} />
          <Route path="/evento/:id"   element={<EventDetailPage />} />
          <Route path="/perfil"       element={<PerfilPage />}
           />
          <Route path="/bienvenida" element={<WelcomeSplash />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
