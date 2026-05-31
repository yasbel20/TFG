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

// Elementos que el navegador ya puede enfocar de forma nativa
const NATIVE_FOCUSABLE = new Set(["button", "a", "input", "select", "textarea"]);

// Selector de contenido legible — excluye elementos utilitarios (overlays, banners)
const CONTENT_SELECTOR = [
  "button:not([tabindex='-1'])",
  "a[href]:not([tabindex='-1'])",
  "input:not([tabindex='-1'])",
  "select:not([tabindex='-1'])",
  "textarea:not([tabindex='-1'])",
  "h1","h2","h3","h4","h5","h6",
  "p","li",
  "[role='button']","[role='listitem']","[role='article']","[role='tab']",
  "img[alt]:not([alt=''])",
  ".eg-card",".ag-card",".ac-card",".type-card",".step",
  ".stat",".ad-row",".tools-feature-row",
  ".faq-item",".showcase-list-item",".agenda-banner-card",
].join(",");

// Contenedores de utilidad que NO deben navegarse con Tab
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
  // Botones con aria-label/title (solo icono) → siempre incluir
  const explicit = el.getAttribute("aria-label") || el.getAttribute("title");
  if (explicit?.trim().length > 1) return true;
  // Resto: necesita texto visible
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

function speak(el) {
  const text = readElement(el);
  if (!text) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "es-ES";
  utt.rate = 0.95;
  window.speechSynthesis.speak(utt);
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

  const updatePref = useCallback((key, val) => {
    setPrefs(p => {
      const next = { ...p, [key]: val };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── MODO TECLADO ──────────────────────────────────────────
  useEffect(() => {
    if (!prefs.keyboard || !("speechSynthesis" in window)) return;

    let idx = -1;
    let cachedEls = null;

    function applyTabindex() {
      document.querySelectorAll(CONTENT_SELECTOR).forEach(ensureFocusable);
      cachedEls = null; // invalidar caché al cambiar el DOM
    }
    applyTabindex();

    // Observar contenido dinámico (eventos que cargan via fetch)
    const observer = new MutationObserver(applyTabindex);
    observer.observe(document.body, { childList: true, subtree: true });

    function getElements() {
      if (!cachedEls) {
        const all = Array.from(document.querySelectorAll(CONTENT_SELECTOR)).filter(isVisible);
        const set = new Set(all);
        // Excluir elementos cuyo ancestro ya está en la lista (evita leer padre e hijo)
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

    // ── Reset índice y caché al navegar (React Router usa history.pushState) ──
    const resetIdx = () => { idx = -1; cachedEls = null; };

    const _origPush    = history.pushState.bind(history);
    const _origReplace = history.replaceState.bind(history);

    history.pushState = (...args) => {
      _origPush(...args);
      // Esperar al siguiente tick para que React actualice el DOM
      setTimeout(resetIdx, 50);
    };
    history.replaceState = (...args) => {
      _origReplace(...args);
      setTimeout(resetIdx, 50);
    };

    window.addEventListener("popstate", resetIdx);

    // ── Manejador de Tab ──
    const tabHandler = (e) => {
      if (e.key !== "Tab") return;
      e.preventDefault();

      const els = getElements();
      if (!els.length) return;

      // Si el elemento actual ya no existe en el DOM (navegación), resetear
      const currentEl = idx >= 0 ? els[idx] : null;
      if (idx >= 0 && (!currentEl || !document.contains(currentEl))) {
        idx = -1;
      }

      idx = e.shiftKey
        ? (idx <= 0 ? els.length - 1 : idx - 1)
        : (idx >= els.length - 1 ? 0 : idx + 1);

      const el = els[idx];
      el.focus({ preventScroll: false });
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      speak(el);
    };

    document.addEventListener("keydown", tabHandler);

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

  // ── CLIC Y ESCUCHAR ───────────────────────────────────────
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

  // ── VISIBILIDAD DE TEXTO ──────────────────────────────────
  useEffect(() => {
    document.body.classList.toggle("a11y-text-vis", !!prefs.textVis);
  }, [prefs.textVis]);

  // ── ESCALA DE GRISES ──────────────────────────────────────
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
