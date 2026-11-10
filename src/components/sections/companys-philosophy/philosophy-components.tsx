import { BackgroundMotion } from "@/components/sections/our-company/background-motion";
import { Lines } from "@/components/ui/lines";

/**
 * The hero's three numbered components of the governance philosophy, drawn like Our
 * Company's background timeline: each number pops in, its dotted rule draws, then the
 * text rises, once the preloader has opened.
 */
export function PhilosophyComponents({
  items,
  label,
}: {
  items: readonly string[];
  label: string;
}) {
  return (
    <BackgroundMotion start="reveal" className="mt-[clamp(36px,4vw,78px)]">
      <ol
        aria-label={label}
        className="grid gap-[clamp(28px,3vw,48px)] sm:grid-cols-3 sm:gap-x-[clamp(24px,4.2vw,80px)]"
      >
        {items.map((item, i) => (
          <li key={i} data-bg-column>
            <div className="flex items-center gap-[clamp(8px,0.58vw,11px)]">
              <span
                aria-hidden
                data-bg-icon
                className="grid size-[clamp(40px,2.7vw,52px)] shrink-0 place-items-center rounded-full border-[3px] border-white text-[clamp(18px,1.25vw,24px)] font-light"
              >
                {i + 1}
              </span>
              <span aria-hidden data-bg-rule className="company-band-rule" />
            </div>
            <p
              data-bg-text
              className="mt-[clamp(18px,2vw,40px)] text-[clamp(18px,1.3vw,25px)] leading-[1.3] font-medium tracking-[-0.03em] rtl:leading-[1.6] rtl:tracking-normal"
            >
              <Lines lines={[item]} />
            </p>
          </li>
        ))}
      </ol>
    </BackgroundMotion>
  );
}
