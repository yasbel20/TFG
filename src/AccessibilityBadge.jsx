const WheelIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="2"/><path d="M10 8h4v5h3l2 4H7l-1.5-4H10V8z"/>
    <path d="M6 16a6 6 0 1 0 12 0" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const SignosIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 9v5h2v7h4v-7h2V9H3zm14 0v5h2v7h4v-7h2V9h-8z"/>
  </svg>
);
const BucleIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm-1-9v5l4-2.5L11 10z"/>
  </svg>
);
const PodoIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
  </svg>
);

const BADGES = [
  { key: "silla",  Icon: WheelIcon,  label: "PMR" },
  { key: "signos", Icon: SignosIcon, label: "Signos" },
  { key: "bucle",  Icon: BucleIcon,  label: "Bucle" },
  { key: "podo",   Icon: PodoIcon,   label: "Podotáctil" },
];

export default function AccessibilityBadge({ types = [], className = "access-chip" }) {
  const present = BADGES.filter(b => types.includes(b.key));
  if (present.length === 0) return null;
  return (
    <div className="access-badges" role="list" aria-label="Atributos de accesibilidad">
      {present.map(({ key, Icon, label }) => (
        <span key={key} className={className} role="listitem" aria-label={label}>
          <Icon /> {label}
        </span>
      ))}
    </div>
  );
}
