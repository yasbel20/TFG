import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AccessibilityContext = createContext(null);
const STORAGE_KEY = "inclugo_a11y_prefs";

const DEFAULT_PREFS = {
  keyboard:    false,
  clickListen: false,
  textVis:     false,
  pageMask:    false,
  grayscale:   false,
};

const NATIVE_FOCUSABLE = new Set(["button", "a", "input", "select", "textarea"]);

const CONTENT_SELECTOR = [
  "button:not([tabindex='-1'])",
  "a[href]:not([tabindex='-1'])",
  "input:not([tabindex='-1'])",
  "select:not([tabindex='-1'])",
  "textarea:not([tabindex='-1'])",
  "h1","h2","h3","h4","h5","h6",
  "p","li:not([data-a11y-nav-item])",
  "[role='button']","[role='listitem']","[role='article']","[role='tab']",
  "img[alt]:not([alt=''])",
  ".eg-card",".ag-card",".ac-card",".type-card",".step",
  ".stat",".ad-row",".tools-feature-row",
  ".faq-item",".showcase-list-item",".agenda-banner-card",
].join(",");

const SKIP_CONTAINERS = [
  ".ck-bar", ".ck-modal",   // cookie banner
  ".ao-panel",              // accessibility overlay panel
  "[data-skip-tab]",
];

function isVisible(el) {
  if (el.closest('[aria-hidden="true"]')) return false;
  if (SKIP_CONTAINERS.some(sel => { try { return el.closest(sel); } catch { return false; } })) return false;
  const s = window.getComputedStyle(el);
  if (s.display === "none" || s.visibility === "hidden" || el.offsetHeight === 0) return false;
  const explicit = el.getAttribute("aria-label") || el.getAttribute("title");
  if (explicit?.trim().length > 1) return true;
  const clone = el.cloneNode(true);
  clone.querySelectorAll("svg,script,style").forEach(n => n.remove());
  const text = clone.textContent?.replace(/\s+/g, " ").trim();
  return !!(text && text.length > 1);
}

function readElement(el) {
  if (!el || el === document.body) return null;
  const explicit =
    el.getAttribute("aria-label") ||
    el.getAttribute("title") ||
    el.getAttribute("placeholder");
  if (explicit?.trim().length > 1) return explicit.trim();
  const clone = el.cloneNode(true);
  clone.querySelectorAll("svg,script,style").forEach(n => n.remove());
  const text = clone.textContent?.replace(/\s+/g, " ").trim().slice(0, 250);
  return text && text.length > 1 ? text : null;
}

// Chrome carga las voces de forma asíncrona — hay que esperar voiceschanged
let cachedVoices = [];
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const loadVoices = () => { cachedVoices = window.speechSynthesis.getVoices(); };
  loadVoices();
  window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
}

// Chrome bug: speechSynthesis se queda paused tras ~15s de inactividad.
// El keepalive hace pause+resume periódicamente para mantenerlo activo mientras habla.
function startSpeechKeepAlive() {
  return setInterval(() => {
    if (!window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }, 10000);
}

function speak(el) {
  const text = readElement(el);
  if (!text) return;
  // Resetea el motor por si Chrome lo tiene atascado
  window.speechSynthesis.cancel();
  setTimeout(() => {
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    const esVoice = cachedVoices.find(v => v.lang.startsWith("es"));
    if (esVoice) utt.voice = esVoice;
    const keepAlive = startSpeechKeepAlive();
    utt.onend   = () => clearInterval(keepAlive);
    utt.onerror = () => clearInterval(keepAlive);
    window.speechSynthesis.speak(utt);
  }, 50);
}

function ensureFocusable(el) {
  const tag = el.tagName?.toLowerCase();
  if (NATIVE_FOCUSABLE.has(tag)) return;
  if (el.hasAttribute("tabindex")) return;
  el.setAttribute("tabindex", "-1");
  el.dataset.a11yTab = "1";
}

function restoreFocusable(el) {
  if (el.dataset.a11yTab) {
    el.removeAttribute("tabindex");
    delete el.dataset.a11yTab;
  }
}

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch { return DEFAULT_PREFS; }
  });
  const [overlayOpen, setOverlayOpen] = useState(false);

  // Persiste el cambio de preferencia en localStorage inmediatamente
  const updatePref = useCallback((key, val) => {
    setPrefs(p => {
      const next = { ...p, [key]: val };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // MODO TECLADO: intercepta Tab para navegar entre elementos legibles y leerlos con speechSynthesis
  useEffect(() => {
    if (!prefs.keyboard || !("speechSynthesis" in window)) return;

    let idx = -1;
    let cachedEls = null;

    function applyTabindex() {
      document.querySelectorAll(CONTENT_SELECTOR).forEach(ensureFocusable);
      cachedEls = null; // invalida caché cuando el DOM cambia
    }
    applyTabindex();

    // MutationObserver: re-aplica tabindex cuando React añade/quita nodos (p.ej. eventos que cargan)
    const observer = new MutationObserver(applyTabindex);
    observer.observe(document.body, { childList: true, subtree: true });

    // Devuelve la lista de elementos navegables, excluyendo hijos de elementos ya en la lista
    function getElements() {
      if (!cachedEls) {
        const all = Array.from(document.querySelectorAll(CONTENT_SELECTOR)).filter(isVisible);
        const set = new Set(all);
        cachedEls = all.filter(el => {
          let p = el.parentElement;
          while (p) {
            if (set.has(p)) return false;
            p = p.parentElement;
          }
          return true;
        });
      }
      return cachedEls;
    }

    const resetIdx = () => { idx = -1; cachedEls = null; };

    // Parchea history.pushState/replaceState porque React Router no emite eventos
    // que podamos escuchar de otra forma al cambiar de página
    const _origPush    = history.pushState.bind(history);
    const _origReplace = history.replaceState.bind(history);

    history.pushState = (...args) => {
      _origPush(...args);
      setTimeout(resetIdx, 50); // espera a que React actualice el DOM
    };
    history.replaceState = (...args) => {
      _origReplace(...args);
      setTimeout(resetIdx, 50);
    };

    window.addEventListener("popstate", resetIdx);

    const tabHandler = (e) => {
      if (e.key !== "Tab") return;
      e.preventDefault(); // evita el comportamiento nativo del navegador

      const els = getElements();
      if (!els.length) return;

      // Si el foco real del DOM diverge del índice (p.ej. el usuario clicó), sincroniza
      const liveIdx = els.indexOf(document.activeElement);
      if (liveIdx !== -1) idx = liveIdx;
      else if (idx >= els.length) idx = -1;

      // Shift+Tab → atrás, Tab → adelante, cíclico
      idx = e.shiftKey
        ? (idx <= 0 ? els.length - 1 : idx - 1)
        : (idx >= els.length - 1 ? 0 : idx + 1);

      const el = els[idx];
      el.focus({ preventScroll: false });
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      speak(el); // lee el elemento con Web Speech API
    };

    document.addEventListener("keydown", tabHandler);

    // Cleanup: restaura el comportamiento original al desactivar el modo
    return () => {
      document.removeEventListener("keydown", tabHandler);
      window.removeEventListener("popstate", resetIdx);
      history.pushState    = _origPush;
      history.replaceState = _origReplace;
      observer.disconnect();
      window.speechSynthesis.cancel();
      document.querySelectorAll("[data-a11y-tab]").forEach(restoreFocusable);
    };
  }, [prefs.keyboard]);

  // MODO CLIC: lee cualquier elemento al hacer clic sobre él
  useEffect(() => {
    if (!prefs.clickListen || !("speechSynthesis" in window)) return;
    const handler = (e) => {
      const el = e.target.closest(
        "[aria-label],[tabindex],p,h1,h2,h3,h4,h5,h6,li,label,button,a,[role='button'],[role='article'],[role='listitem']"
      );
      if (!el) return;
      speak(el);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [prefs.clickListen]);

  // Resaltar texto legible: añade clase CSS al body
  useEffect(() => {
    document.body.classList.toggle("a11y-text-vis", !!prefs.textVis);
  }, [prefs.textVis]);

  // Escala de grises: añade clase CSS al elemento raíz
  useEffect(() => {
    document.documentElement.classList.toggle("a11y-grayscale", !!prefs.grayscale);
  }, [prefs.grayscale]);

  return (
    <AccessibilityContext.Provider value={{ prefs, updatePref, overlayOpen, setOverlayOpen }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
