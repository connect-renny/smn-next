type Family = {
  count: number;
  /** Start height, two control heights and end height, each with its per-line step. */
  from: [number, number];
  c1: [number, number];
  c2: [number, number];
  to: [number, number];
};

/** Crossing lines in the manner of the 2025 report's cover. */
const FAMILIES: Family[] = [
  { count: 22, from: [300, 14], c1: [760, 7], c2: [720, -3], to: [40, 25] },
  { count: 16, from: [520, 17], c1: [640, -3], c2: [860, 5], to: [260, 24] },
];

function linePath({ from, c1, c2, to }: Family, i: number) {
  const y = ([start, step]: [number, number]) => start + step * i;
  return `M-20 ${y(from)}C480 ${y(c1)} 960 ${y(c2)} 1460 ${y(to)}`;
}

/** Decorative line art for the generated covers. */
export function ReportWeave({ className, stroke }: { className?: string; stroke: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className={className}
    >
      {FAMILIES.map((family, f) =>
        Array.from({ length: family.count }, (_, i) => (
          <path key={`${f}-${i}`} d={linePath(family, i)} stroke={stroke} strokeWidth={1.4} />
        )),
      )}
    </svg>
  );
}
