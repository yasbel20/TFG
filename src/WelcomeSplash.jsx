import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./WelcomeSplash.css";

export default function WelcomeSplash() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (location.state?.onboarding) {
        navigate("/perfil", { state: { onboarding: true } });
      } else {
        navigate("/");
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ws-wrap">
      <video
        className="ws-video"
        src="/img/personaje.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={e => {
          if (e.target.currentTime >= 4) e.target.pause();
        }}
      />
      <p className="ws-greeting">Bienvenido a INCLUGO</p>
      <p className="ws-name">{user?.name}</p>
      <p className="ws-tagline">Descubre la cultura de Madrid a tu medida</p>
      <div className="ws-bar-track">
        <div className="ws-bar-fill" />
      </div>
    </div>
  );
}
