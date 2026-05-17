import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      fontFamily: "'Inter', sans-serif",
      textAlign: "center",
    }}>
      <video
        src="/img/personaje.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={e => {
          if (e.target.currentTime >= 4) {
            e.target.pause();
          }
        }}
        style={{
          width: "280px",
          animation: "slideIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards",
          borderRadius: "12px",
        }}
      />

      <p style={{
        fontSize: "22px",
        fontWeight: "700",
        marginTop: "1.5rem",
        animation: "fadeUp 0.5s ease 0.6s both",
        color: "#888",
        fontFamily: "'Inter', sans-serif",
        letterSpacing: "0.04em",
      }}>
        Bienvenido a INCLUGO
      </p>

      <p style={{
        fontSize: "42px",
        fontWeight: "800",
        marginTop: "0.2rem",
        animation: "fadeUp 0.5s ease 0.8s both",
        color: "#111",
        fontFamily: "'Bebas Neue', sans-serif",
        letterSpacing: "0.05em",
        lineHeight: 1.1,
      }}>
        {user?.name}
      </p>

      <p style={{
        fontSize: "15px",
        color: "#aaa",
        marginTop: "0.6rem",
        animation: "fadeUp 0.5s ease 1s both",
        fontFamily: "'Inter', sans-serif",
      }}>
        Descubre la cultura de Madrid a tu medida
      </p>

      <div style={{
        width: "160px", height: "3px",
        background: "#e5e5e5",
        borderRadius: "99px",
        marginTop: "2rem",
        overflow: "hidden",
        animation: "fadeUp 0.3s ease 1s both",
      }}>
        <div style={{
          height: "100%",
          background: "#3D47C8",
          borderRadius: "99px",
          animation: "fillBar 4.3s linear 0.2s both",
        }} />
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(60px) scale(0.75); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fillBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}