import { useState, useEffect } from "react";
import { MADRID_EVENTS_URL } from "../constants/api";
import { parseEvent } from "../utils/parsing";

const SAMPLE = [
  { id:1, title:"Concierto accesible de primavera", cat:"Música",     dateShort:"15 ABR",       date:"15 de abril de 2026",  timeStr:"19:00 h", venue:"Auditorio Nacional",      district:"Salamanca", price:"15 €",   access:["silla","bucle"],  image:null, url:"#", org:"", descFull:"" },
  { id:2, title:"Teatro inclusivo: La tempestad",   cat:"Teatro",     dateShort:"18 ABR",       date:"18 de abril de 2026",  timeStr:"20:30 h", venue:"Teatro Español",          district:"Centro",    price:"12 €",   access:["signos","silla"], image:null, url:"#", org:"", descFull:"" },
  { id:3, title:"Exposición Arte y Diversidad",     cat:"Exposición", dateShort:"TODO ABR",     date:"Todo abril",           timeStr:"10–20 h", venue:"Museo Reina Sofía",       district:"Centro",    price:"Gratis", access:["silla","audio"],  image:null, url:"#", org:"", descFull:"" },
  { id:4, title:"Ciclo de cine subtitulado",        cat:"Cine",       dateShort:"19 ABR",       date:"19 de abril de 2026",  timeStr:"18:00 h", venue:"Cineteca Madrid",         district:"Arganzuela",price:"5 €",    access:["subtitulos"],     image:null, url:"#", org:"", descFull:"" },
  { id:5, title:"Concierto flamenco accesible",     cat:"Música",     dateShort:"20 ABR",       date:"20 de abril de 2026",  timeStr:"21:00 h", venue:"Café de las Artes",       district:"Malasaña",  price:"10 €",   access:["silla"],          image:null, url:"#", org:"", descFull:"" },
  { id:6, title:"Feria del Libro de Madrid",        cat:"Cultura",    dateShort:"24 ABR–1 MAY", date:"24 de abril – 1 mayo", timeStr:"",        venue:"Parque del Retiro",       district:"Retiro",    price:"Gratis", access:["silla"],          image:null, url:"#", org:"", descFull:"" },
  { id:7, title:"Noche de Danza Contemporánea",     cat:"Danza",      dateShort:"22 ABR",       date:"22 de abril de 2026",  timeStr:"",        venue:"Teatro del Canal",        district:"Chamberí",  price:"18 €",   access:["silla","signos"], image:null, url:"#", org:"", descFull:"" },
  { id:8, title:"Exposición: Carteles Madrid",      cat:"Exposición", dateShort:"TODO ABR",     date:"Todo abril",           timeStr:"",        venue:"Círculo de Bellas Artes", district:"Centro",    price:"Gratis", access:["silla"],          image:null, url:"#", org:"", descFull:"" },
];

export function useEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    // Lanza dos peticiones en paralelo para no bloquear una con la otra
    const madridFetch = fetch(MADRID_EVENTS_URL)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); });

    // El backend devuelve un mapa { api_id: url_imagen } con imágenes locales
    const imgFetch = fetch("/api/imagenes-eventos")
      .then(r => r.ok ? r.json() : {})
      .catch(() => ({}));

    Promise.all([madridFetch, imgFetch])
      .then(([data, imgMap]) => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const parsed = (data["@graph"] || []).map(parseEvent)
          .filter(e => e.access.length > 0)      // solo eventos con accesibilidad definida
          .filter(e => !e.endDate || e.endDate >= today); // solo eventos no caducados
        const withImgs = parsed.map(ev => ({
          ...ev,
          image: imgMap[ev.id] || ev.image, // imagen local tiene prioridad sobre la de la API
        }));
        setAllEvents(withImgs);
        setLoading(false);
      })
      .catch(() => { setAllEvents(SAMPLE); setLoading(false); }); // fallback si la API falla
  }, []);

  return {
    // Filtra por categoría en memoria, sin nueva petición al servidor
    byCategory: (cat) => cat === "Todos" ? allEvents : allEvents.filter(e => e.cat === cat),
    loading,
    total: allEvents.length,
  };
}
