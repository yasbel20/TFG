const BASE_IMG = "https://www.madrid.es";

function resolveImage(item) {
  const raw = item.media?.["@id"] || item.media?.url || item.image || item["@thumbnail"] || null;
  if (!raw) return null;
  return raw.startsWith("http") ? raw : BASE_IMG + raw;
}

// Infiere la categoría por palabras clave en título + descripción
function detectCategory(title, description) {
  const text = (title + " " + description).toLowerCase();
  if (/concierto|música|jazz|flamenco|rock|pop/.test(text))    return "Música";
  if (/teatro|obra|ballet|ópera/.test(text))                   return "Teatro";
  if (/exposici|muestra|exhibit|galería/.test(text))           return "Exposición";
  if (/cine|film|pelícu/.test(text))                           return "Cine";
  if (/danza|baile/.test(text))                                return "Danza";
  return "Cultura";
}

// Mapea los códigos numéricos de la API del Ayuntamiento a etiquetas internas.
// Nota: el campo se llama "accesility" (typo en la API original, no nuestro)
// Códigos: 1/2 → silla de ruedas, 4 → lengua de signos, 5 → podotáctil, 6 → bucle magnético
function parseAccessibility(item) {
  const raw   = item.organization?.["accesibility"] || "";
  const codes = raw.toString().split(",").map(c => c.trim()).filter(Boolean);
  const access = [];
  if (codes.includes("1") || codes.includes("2")) access.push("silla");
  if (codes.includes("4"))                         access.push("signos");
  if (codes.includes("5"))                         access.push("podo");
  if (codes.includes("6"))                         access.push("bucle");
  return access;
}

function parsePrice(item) {
  const fee = item["event-free"] ?? item.free;
  const isFree = !(fee === false || fee === "false" || fee === 0 || fee === "0");
  if (isFree) return "Gratis";
  const raw = String(item["event-fee"] || item.price || "").trim();
  return /^\d+([.,]\d+)?$/.test(raw) ? `${raw.replace(",", ".")} €` : "Ver precio";
}

function parseDates(item) {
  if (!item.dtstart) {
    return { dateKey: "sin-fecha", dateShort: "Consultar", date: "Consultar fecha", timeStr: "", sortTs: Infinity, startDate: null, endDate: null };
  }
  const s = new Date(item.dtstart);
  const e = item.dtend ? new Date(item.dtend) : null;

  const yyyy = s.getFullYear();
  const mm   = String(s.getMonth() + 1).padStart(2, "0");
  const dd   = String(s.getDate()).padStart(2, "0");
  const dateKey = `${yyyy}-${mm}-${dd}`;

  const fmtS = { day: "numeric", month: "short" };
  const fmtL = { day: "numeric", month: "long", year: "numeric" };
  let dateShort = s.toLocaleDateString("es-ES", fmtS).toUpperCase();
  let date      = s.toLocaleDateString("es-ES", fmtL);

  if (e && e.toDateString() !== s.toDateString()) {
    dateShort = `${dateShort} – ${e.toLocaleDateString("es-ES", fmtS).toUpperCase()}`;
    date      = `${date} – ${e.toLocaleDateString("es-ES", fmtL)}`;
  }

  const h = s.getHours(), m = s.getMinutes();
  const timeStr = (h !== 0 || m !== 0)
    ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} h`
    : "";

  return { dateKey, dateShort, date, timeStr, sortTs: s.getTime(), startDate: s, endDate: e || s };
}

// Transforma un objeto crudo de la API del Ayuntamiento al formato interno de la app.
// Es la función más importante del frontend — todos los componentes consumen su resultado.
export function parseEvent(item, i) {
  const title = item.title || "Evento sin título";
  const desc  = (item.description || "").toLowerCase();
  const org   = item.organization?.["organization-name"] || "";
  const cat   = detectCategory(title, desc + " " + org);
  const access = parseAccessibility(item);
  const price  = parsePrice(item);
  const dates  = parseDates(item);

  const venueRaw = item.location?.["street-address"] || org || "Madrid";
  const venue    = venueRaw.length > 38 ? venueRaw.slice(0, 36) + "…" : venueRaw;

  return {
    id:       item.id || `ev-${i}`,
    title,
    cat,
    access,
    price,
    venue,
    venueRaw,
    district:  item.address?.["locality"] || "Madrid",
    image:     resolveImage(item),
    url:       item.link || "#",
    descFull:  (item.description || "").replace(/<[^>]+>/g, "").trim(),
    org,
    ...dates,
  };
}
