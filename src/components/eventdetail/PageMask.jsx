import { useState, useEffect } from "react";

export default function PageMask() {
  const [y, setY] = useState(200);

  useEffect(() => {
    const h = (e) => setY(e.clientY);
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <div className="ed-page-mask" aria-hidden="true" style={{
      background: `linear-gradient(
        to bottom,
        rgba(0,0,0,.85) 0,
        rgba(0,0,0,.85) ${y - 40}px,
        transparent ${y - 40}px,
        transparent ${y + 60}px,
        rgba(0,0,0,.85) ${y + 60}px
      )`
    }}/>
  );
}
