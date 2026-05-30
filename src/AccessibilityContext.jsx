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
  // Preferir aria-label / title / placeholder
  const explicit =
    el.getAttribute("aria-label") ||
    el.getAttribute("title") ||
    el.getAttribute("placeholder");
  if (explicit?.trim().length > 1) return explicit.trim();
  // Texto visible: clonar y eliminar hijos SVG para evitar leer paths
  const clone = el.cloneNode(true);
  clone.querySelectorAll("svg,script,style").forEach(n => n.remove());
  const text = clone.textContent?.replace(/\s+/g, " ").trim().slice(0, 200);
  return text && text.length > 1 ? text : null;
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

  // Modo teclado — leer elemento al recibir foco (Tab)
  useEffect(() => {
    if (!prefs.keyboard || !("speechSynthesis" in window)) return;

    const handler = (e) => {
      // Subir desde SVG/path al elemento interactivo real
      let target = e.target;
      const svgTags = ["svg","path","circle","rect","line","polyline","polygon","g"];
      if (svgTags.includes(target.tagName?.toLowerCase())) {
        target = target.closest("button,a,[tabindex]") || target;
      }
      if (target === document.body) return;
      const text = readElement(target);
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

  // Clic y escuchar global — selector amplio para cubrir todas las páginas
  useEffect(() => {
    if (!prefs.clickListen || !("speechSynthesis" in window)) return;

    const handler = (e) => {
      const el = e.target.closest(
        "[aria-label],[tabindex],p,h1,h2,h3,h4,h5,h6,li,label,button,a,[role='button'],[role='article'],[role='listitem']"
      );
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
