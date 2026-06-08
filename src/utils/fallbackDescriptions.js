const ACC_MAP = {
  silla:  "acceso completo para personas con movilidad reducida",
  signos: "intérprete de lengua de signos española (LSE)",
  bucle:  "bucle magnético para personas con audífono o implante coclear",
  podo:   "pavimento podotáctil para personas con discapacidad visual",
};

const TEMPLATES = {
  "Música": [
    (v, d) => `Concierto en vivo en ${v}, en el barrio de ${d}. Una velada musical pensada para todos los públicos, con el mejor ambiente de la escena cultural madrileña.`,
    (v)    => `${v} acoge esta propuesta musical en directo. Disfruta de las actuaciones en un espacio preparado para recibir a todos los asistentes con plena comodidad.`,
  ],
  "Teatro": [
    (v)    => `Representación teatral en ${v}. Una propuesta escénica que invita a reflexionar y emocionarse en uno de los escenarios de referencia de Madrid.`,
    (v, d) => `El escenario de ${v}, en ${d}, acoge esta producción teatral. Vive el teatro en directo con todos los recursos de accesibilidad disponibles.`,
  ],
  "Exposición": [
    (v)    => `Muestra artística en ${v}. Una oportunidad para descubrir el arte y la cultura madrileña en un espacio abierto a todos los públicos.`,
    (v, d) => `${v} presenta esta exposición en ${d}. Una propuesta que invita a explorar nuevas perspectivas artísticas en un entorno accesible e inclusivo.`,
  ],
  "Cine": [
    (v)    => `Proyección cinematográfica en ${v}. Una sesión especial para disfrutar del séptimo arte con las mejores condiciones de comodidad y accesibilidad.`,
    (v, d) => `El cine llega a ${v}, en ${d}, con esta selección especial. Una sesión adaptada para que nadie se pierda la experiencia de la gran pantalla.`,
  ],
  "Danza": [
    (v)    => `Espectáculo de danza en ${v}. El movimiento y la expresión corporal se convierten en el lenguaje universal de este evento en vivo.`,
    (v, d) => `${v}, en ${d}, acoge este espectáculo de danza que fusiona técnica y emoción. Una propuesta accesible para los amantes de las artes escénicas.`,
  ],
  "Cultura": [
    (v)    => `Actividad cultural en ${v}. Un evento que celebra la diversidad artística de Madrid en un espacio abierto e inclusivo para todos los públicos.`,
    (v, d) => `${v} es el escenario de este encuentro cultural en ${d}. Una propuesta pensada para quienes disfrutan de la cultura y el patrimonio de la ciudad.`,
  ],
};

export function getFallbackDescription(ev) {
  if (ev.descFull) return ev.descFull;

  const venueName = ev.venueRaw || ev.venue || "Madrid";
  const district  = ev.district  || "Madrid";
  const cat       = ev.cat       || "Cultura";
  const access    = ev.access    || [];
  const price     = ev.price     || "";

  const options = TEMPLATES[cat] || TEMPLATES["Cultura"];
  const idx     = (String(ev.id).charCodeAt(0) ?? 0) % options.length;
  const base    = options[idx](venueName, district);

  const accParts = access.map(a => ACC_MAP[a]).filter(Boolean);
  const accText  =
    accParts.length === 0 ? "" :
    accParts.length === 1 ? ` Cuenta con ${accParts[0]}.` :
    ` Cuenta con ${accParts.slice(0, -1).join(", ")} y ${accParts.at(-1)}.`;

  const priceText = price === "Gratis" ? " Entrada gratuita." :
                    price              ? ` Precio: ${price}.` : "";

  return base + accText + priceText;
}
