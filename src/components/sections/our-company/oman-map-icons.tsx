import type { OmanPlaceKind } from "@/content/our-company";

/** The client map's four marker types, redrawn to sit on the dotted map. */
export function OmanMapIcon({ kind }: { kind: OmanPlaceKind }) {
  switch (kind) {
    case "power":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="size-full">
          <g fill="#f39200">
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d="M12 0.8l1.5 5h-3z" transform={`rotate(${i * 30} 12 12)`} />
            ))}
            <circle cx="12" cy="12" r="6.6" />
          </g>
          <circle cx="12" cy="12" r="2.6" fill="#ffd9a0" />
        </svg>
      );
    case "desalination":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="size-full">
          <path
            d="M12 1.500s8.200 9.400 8.200 14.200a8.200 8.200 0 0 1-16.400 0C3.800 10.900 12 1.500 12 1.500z"
            fill="#4cb8f0"
            stroke="#fff"
            strokeWidth="1.3"
          />
        </svg>
      );
    case "capital":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="size-full">
          <circle cx="12" cy="12" r="11" fill="#0a1e51" stroke="#fff" strokeWidth="1.4" />
          <path
            d="M12 5.300l2 4.300 4.700.6-3.500 3.200.9 4.700-4.100-2.300-4.100 2.300.9-4.700-3.500-3.200 4.700-.6z"
            fill="#f9b233"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="size-full">
          <circle cx="12" cy="12" r="11" fill="#0a1e51" stroke="#fff" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="5.2" fill="#fff" />
        </svg>
      );
  }
}
