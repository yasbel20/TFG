import { useLocation, useNavigate, useParams } from "react-router-dom";
import EventDetail from "./EventDetail";
import Navbar from "./Navbar";
import { JUNE_EVENTS } from "./juneEvents";

export default function EventDetailPage() {
  const { state } = useLocation();
  const { id }    = useParams();
  const navigate  = useNavigate();

  const ev = state?.ev || JUNE_EVENTS.find(e => String(e.id) === String(id));

  if (!ev) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "4rem 2rem", textAlign: "center", fontFamily: "Inter, sans-serif" }}>
          <p style={{ color: "#666", marginBottom: "1rem" }}>Evento no encontrado.</p>
          <button
            onClick={() => navigate("/")}
            style={{ padding: ".6rem 1.5rem", background: "#111", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Volver al inicio
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <EventDetail ev={ev} onBack={() => navigate(-1)} />
    </>
  );
}
