import { useLocation, useNavigate } from "react-router-dom";
import EventDetail from "./EventDetail";
import Navbar from "./Navbar";

export default function EventDetailPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const ev = state?.ev;

  if (!ev) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "4rem 2rem", textAlign: "center", fontFamily: "Inter, sans-serif" }}>
          <p style={{ color: "#666", marginBottom: "1rem" }}>Evento no encontrado.</p>
          <button
            onClick={() => navigate("/eventos")}
            style={{ padding: ".6rem 1.5rem", background: "#111", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Ver todos los eventos
          </button>
        </div>
      </>
    );
  }

  return <EventDetail ev={ev} onBack={() => navigate(-1)} />;
}
