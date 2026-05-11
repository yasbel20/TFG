import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import INCLUGOHome from "./home";
import EventsPage from "./EventsPage";
import AgendaPage from "./AgendaPage";
import EventDetailPage from "./EventDetailPage";
import PerfilPage from "./PerfilPage";

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
          <Route path="/perfil"       element={<PerfilPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
