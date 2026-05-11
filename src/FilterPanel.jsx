const ACCESS_OPTIONS = [
  "Toda la accesibilidad",
  "Silla de ruedas",
  "Lengua de signos",
  "Podotáctil",
  "Bucle magnético",
];

export default function FilterPanel({ activeAccess, onSelect }) {
  return (
    <div className="fp-bar" role="group" aria-label="Filtrar por tipo de accesibilidad">
      {ACCESS_OPTIONS.map(opt => {
        const isAll    = opt === "Toda la accesibilidad";
        const isActive = opt === activeAccess;
        return (
          <button
            key={opt}
            className={`fp-pill${isActive ? " fp-pill--active" : ""}`}
            onClick={() => onSelect(opt)}
            aria-pressed={isActive}
          >
            {isAll ? "Todas" : opt}
          </button>
        );
      })}
    </div>
  );
}
