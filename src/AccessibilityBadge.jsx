import { WheelIcon, HandsIcon, BucleIcon, PodoIcon } from "./AccessibilityIcons";

const BADGES = [
  { key: "silla",  Icon: WheelIcon,  label: "PMR" },
  { key: "signos", Icon: HandsIcon,  label: "Signos" },
  { key: "bucle",  Icon: BucleIcon,  label: "Bucle" },
  { key: "podo",   Icon: PodoIcon,   label: "Podotáctil" },
];

const chipStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "3px",
  fontFamily: "'Inter', sans-serif",
  fontSize: ".62rem",
  fontWeight: 600,
  color: "#ffffff",
  lineHeight: 1,
  whiteSpace: "nowrap",
};

export default function AccessibilityBadge({ types = [], className, style }) {
  const present = BADGES.filter(b => types.includes(b.key));
  if (present.length === 0) return null;
  return (
    <div
      className="access-badges"
      style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px" }}
      role="list"
      aria-label="Atributos de accesibilidad"
    >
      {present.map(({ key, Icon, label }) => (
        <span
          key={key}
          className={className}
          style={{ ...chipStyle, ...style }}
          role="listitem"
          aria-label={label}
        >
          <Icon /> {label}
        </span>
      ))}
    </div>
  );
}
