import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeech(text, rate = 0.95) {
  const [status, setStatus]       = useState("idle");
  const [wordIndex, setWordIndex] = useState(-1);
  const uttRef                    = useRef(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const words = text ? text.split(/\s+/) : [];

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setStatus("idle"); setWordIndex(-1);
  }, [supported]);

  const play = useCallback(() => {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();

    // Pre-calculate exact word positions to map charIndex → word index unambiguously
    const wordPositions = [];
    const re = /\S+/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      wordPositions.push({ start: m.index, end: m.index + m[0].length - 1 });
    }

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "es-ES"; utt.rate = rate;
    utt.onboundary = (e) => {
      if (e.name !== "word") return;
      const ci = e.charIndex;
      let idx = wordPositions.findIndex(w => ci >= w.start && ci <= w.end);
      if (idx === -1) idx = wordPositions.findIndex(w => ci < w.end);
      if (idx === -1) idx = wordPositions.length - 1;
      setWordIndex(idx);
      const el = document.querySelector(`[data-wi="${idx}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    utt.onstart  = () => setStatus("playing");
    utt.onend    = () => { setStatus("idle"); setWordIndex(-1); };
    utt.onpause  = () => setStatus("paused");
    utt.onresume = () => setStatus("playing");
    utt.onerror  = () => { setStatus("idle"); setWordIndex(-1); };
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

  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);

  return { supported, status, wordIndex, words, play, pause, stop, skipBack, skipFwd };
}
