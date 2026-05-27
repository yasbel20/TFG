import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AccessibilityContext = createContext(null);

const STORAGE_KEY = "inclugo_a11y_prefs";

const DEFAULT_PREFS = {
  keyboard:    false,
  clickListen: false,
  textVis:     false,
  pageMask:    false,
};

function readElement(el) {
  if (!el || el === document.body) return null;
  const label =
    el.getAttribute("aria-label") ||
    el.getAttribute("title") ||
    el.getAttribute("placeholder") ||
    el.textContent?.trim().slice(0, 120) ||
    null;
  return label && label.length > 1 ? label : null;
}

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch { return DEFAULT_PREFS; }
  });

  const updatePref = useCallback((key, val) => {
    setPrefs(p => {
      const next = { ...p, [key]: val };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Opción A — leer elemento enfocado con Tab
  useEffect(() => {
    if (!prefs.keyboard || !("speechSynthesis" in window)) return;

    const handler = (e) => {
      if (e.target === document.body) return;
      const text = readElement(e.target);
      if (!text) return;
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = "es-ES";
      utt.rate = 0.95;
      window.speechSynthesis.speak(utt);
    };

    document.addEventListener("focusin", handler);
    return () => {
      document.removeEventListener("focusin", handler);
      window.speechSynthesis.cancel();
    };
  }, [prefs.keyboard]);

  // Clic y escuchar global
  useEffect(() => {
    if (!prefs.clickListen || !("speechSynthesis" in window)) return;

    const handler = (e) => {
      const el = e.target.closest("p,h1,h2,h3,li,label,button,a");
      if (!el) return;
      const text = readElement(el);
      if (!text) return;
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = "es-ES";
      utt.rate = 0.95;
      window.speechSynthesis.speak(utt);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [prefs.clickListen]);

  // Visibilidad de texto — clase en body
  useEffect(() => {
    document.body.classList.toggle("a11y-text-vis", !!prefs.textVis);
  }, [prefs.textVis]);

  return (
    <AccessibilityContext.Provider value={{ prefs, updatePref }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
