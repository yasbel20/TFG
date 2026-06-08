const ACCESS_OPTIONS = [
  "Toda la accesibilidad",
  "Silla de ruedas",
  "Lengua de signos",
  "Podotáctil",
  "Bucle magnético",
];

// Barra de filtros de accesibilidad. Recibe el filtro activo y notifica cambios al padre.
// El filtrado real ocurre en el componente padre, no aquí.
export default function FilterPanel({ activeAccess, onSelect }) {
  return (
    // role="group" + aria-label describe el conjunto de botones al lector de pantalla
    <div className="fp-bar" role="group" aria-label="Filtrar por tipo de accesibilidad">
      {ACCESS_OPTIONS.map(opt => {
        const isAll    = opt === "Toda la accesibilidad";
        const isActive = opt === activeAccess;
        return (
          <button
            key={opt}
            className={`fp-pill${isActive ? " fp-pill--active" : ""}`}
            onClick={() => onSelect(opt)}
            aria-pressed={isActive} // comunica el estado activo/inactivo al lector de pantalla
          >
            {isAll ? "Todas" : opt}
          </button>
        );
      })}
    </div>
  );
}
