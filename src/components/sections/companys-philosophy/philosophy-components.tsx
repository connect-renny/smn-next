import { Lines } from "@/components/ui/lines";

/** The hero's three numbered components of the governance philosophy. */
export function PhilosophyComponents({
  items,
  label,
}: {
  items: readonly string[];
  label: string;
}) {
  return (
    <ol
      aria-label={label}
      className="mt-[clamp(36px,4vw,78px)] grid gap-[clamp(28px,3vw,48px)] sm:grid-cols-3 sm:gap-x-[clamp(24px,4.2vw,80px)]"
    >
      {items.map((item, i) => (
        <li key={i} data-hero-fade>
          <span
            aria-hidden
            className="grid size-[clamp(40px,2.7vw,52px)] place-items-center rounded-full border-[3px] border-white text-[clamp(18px,1.25vw,24px)] font-light"
          >
            {i + 1}
          </span>
          <p className="mt-[clamp(18px,2vw,40px)] text-[clamp(18px,1.3vw,25px)] leading-[1.3] font-medium tracking-[-0.03em] rtl:leading-[1.6] rtl:tracking-normal">
            <Lines lines={[item]} />
          </p>
        </li>
      ))}
    </ol>
  );
}
