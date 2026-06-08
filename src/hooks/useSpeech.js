import { useState, useRef, useCallback, useEffect } from "react";

// Hook que gestiona la reproducción de texto con Web Speech API.
// Expone estado (idle/playing/paused), índice de palabra activa y controles play/pause/stop.
export function useSpeech(text, rate = 0.95) {
  const [status, setStatus]       = useState("idle");
  const [wordIndex, setWordIndex] = useState(-1); // índice de la palabra que se está leyendo
  const uttRef                    = useRef(null);
  const userScrolling             = useRef(false);
  const scrollTimerRef            = useRef(null);
  const cleanupScroll             = useRef(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const words = text ? text.split(/\s+/) : [];

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    cleanupScroll.current?.();
    setStatus("idle"); setWordIndex(-1);
  }, [supported]);

  const play = useCallback(() => {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();
    cleanupScroll.current?.();

    // Pre-calcula la posición de cada palabra en el texto para el resaltado
    const wordPositions = [];
    const re = /\S+/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      wordPositions.push({ start: m.index, end: m.index + m[0].length - 1 });
    }

    // Detecta scroll manual del usuario para pausar el auto-scroll 2.5s
    const onUserScroll = () => {
      userScrolling.current = true;
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        userScrolling.current = false;
      }, 2500);
    };
    window.addEventListener("wheel",     onUserScroll, { passive: true });
    window.addEventListener("touchmove", onUserScroll, { passive: true });

    cleanupScroll.current = () => {
      window.removeEventListener("wheel",     onUserScroll);
      window.removeEventListener("touchmove", onUserScroll);
      clearTimeout(scrollTimerRef.current);
      userScrolling.current  = false;
      cleanupScroll.current  = null;
    };

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "es-ES"; utt.rate = rate;

    // onboundary se dispara en cada nueva palabra — actualiza el índice para resaltar
    // y hace scroll automático al elemento [data-wi="idx"] si el usuario no está scrolleando
    utt.onboundary = (e) => {
      if (e.name !== "word") return;
      const ci = e.charIndex;
      let idx = wordPositions.findIndex(w => ci >= w.start && ci <= w.end);
      if (idx === -1) idx = wordPositions.findIndex(w => ci < w.end);
      if (idx === -1) idx = wordPositions.length - 1;
      setWordIndex(idx);
      if (!userScrolling.current) {
        const el = document.querySelector(`[data-wi="${idx}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    utt.onstart  = () => setStatus("playing");
    utt.onend    = () => { cleanupScroll.current?.(); setStatus("idle"); setWordIndex(-1); };
    utt.onpause  = () => setStatus("paused");
    utt.onresume = () => setStatus("playing");
    utt.onerror  = () => { cleanupScroll.current?.(); setStatus("idle"); setWordIndex(-1); };

    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [supported, text, rate]);

  const pause = useCallback(() => {
    if (!supported) return;
    if (status === "playing") { window.speechSynthesis.pause(); setStatus("paused"); }
    else if (status === "paused") { window.speechSynthesis.resume(); setStatus("playing"); }
  }, [supported, status]);

  const skipBack = useCallback(() => { stop(); }, [stop]);
  const skipFwd  = useCallback(() => { stop(); }, [stop]);

  useEffect(() => () => {
    if (supported) window.speechSynthesis.cancel();
    cleanupScroll.current?.();
  }, [supported]);

  return { supported, status, wordIndex, words, play, pause, stop, skipBack, skipFwd };
}
