// useUnsplash.js
// ─────────────────────────────────────────────────────────────────────────────
// Hook centralizado para obtener imágenes de Unsplash.
// Estrategia: caché en memoria por query → máximo 7 llamadas para todo el grid.
//
// CONFIGURACIÓN:
//   1. Ve a https://unsplash.com/developers y crea una aplicación gratuita.
//   2. Copia tu Access Key y pégala en UNSPLASH_KEY abajo.
//
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

// ── PON AQUÍ TU ACCESS KEY DE UNSPLASH ───────────────────────────────────────
const UNSPLASH_KEY = "TU_ACCESS_KEY_AQUI";

// ── Queries por categoría — en español e inglés para mejores resultados ───────
const CAT_QUERIES = {
  "Música":     "live music concert performance",
  "Teatro":     "theater stage performance drama",
  "Exposición": "art exhibition museum gallery",
  "Cine":       "cinema movie film theater",
  "Danza":      "dance performance ballet stage",
  "Cultura":    "culture festival art madrid",
  "Deporte":    "sport event stadium outdoor",
  "default":    "madrid culture event",
};

// ── Caché en memoria (persiste mientras la app está abierta) ──────────────────
const cache = {};

// ── Fetch a Unsplash con caché ────────────────────────────────────────────────
async function fetchUnsplash(query) {
  if (cache[query]) return cache[query];

  try {
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high&client_id=${UNSPLASH_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Unsplash ${res.status}`);
    const data = await res.json();
    // Guardamos la URL small (400px) para tarjetas y regular (1080px) para hero
    const result = {
      small:   data.urls?.small   || null,
      regular: data.urls?.regular || null,
      thumb:   data.urls?.thumb   || null,
      alt:     data.alt_description || query,
      credit:  data.user?.name    || "Unsplash",
      creditUrl: data.user?.links?.html || "https://unsplash.com",
    };
    cache[query] = result;
    return result;
  } catch (err) {
    console.warn("Unsplash fetch error:", err.message);
    cache[query] = null;
    return null;
  }
}

// ── Hook principal ────────────────────────────────────────────────────────────
// Uso: const { imgSmall, imgRegular, loading } = useUnsplash(ev);
//
// Prioridad:
//   1. Imagen real de la API del Ayuntamiento (ev.image)
//   2. Imagen de Unsplash por categoría
//   3. null → fallback oscuro existente
//
export function useUnsplash(ev) {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si el evento ya tiene imagen de la API del Ayuntamiento, la usamos
    if (ev?.image) {
      setResult({ small: ev.image, regular: ev.image, alt: ev.title });
      return;
    }

    const query = CAT_QUERIES[ev?.cat] || CAT_QUERIES["default"];

    // Si ya está en caché, usarla sin llamada
    if (cache[query] !== undefined) {
      setResult(cache[query]);
      return;
    }

    setLoading(true);
    fetchUnsplash(query).then(res => {
      setResult(res);
      setLoading(false);
    });
  }, [ev?.id, ev?.cat, ev?.image]);

  return {
    imgSmall:   result?.small   || null,
    imgRegular: result?.regular || null,
    imgThumb:   result?.thumb   || null,
    imgAlt:     result?.alt     || ev?.title || "",
    imgCredit:  result?.credit  || null,
    imgCreditUrl: result?.creditUrl || null,
    loading,
  };
}

// ── Pre-carga todas las categorías al arrancar la app ─────────────────────────
// Llama a esto una vez en App.jsx o home.jsx para calentar la caché
// antes de que el usuario vea el grid.
export function preloadUnsplashCategories() {
  Object.values(CAT_QUERIES).forEach(q => {
    if (!cache[q]) fetchUnsplash(q);
  });
}
