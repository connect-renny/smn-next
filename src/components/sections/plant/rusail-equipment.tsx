import { Droplet } from "@/components/ui/droplet";
import { Lines } from "@/components/ui/lines";
import type { Dictionary } from "@/i18n/get-dictionary";

const HEADING =
  "flex items-center gap-[clamp(10px,0.8vw,14px)] text-[clamp(20px,1.36vw,26px)] leading-[1.25] font-medium tracking-[-0.03em] rtl:leading-[1.5] rtl:tracking-normal";

/**
 * Al Rusail's equipment, from the live page's four headed blocks: the gas turbines and
 * their four phases on one side, generators, transformers and switchgear on the other.
 */
export function RusailEquipment({ copy }: { copy: Dictionary["rusailPlant"]["equipment"] }) {
  const { turbines, parts } = copy;

  return (
    <div className="mt-[clamp(40px,5.5vw,106px)] grid gap-[clamp(40px,4.2vw,80px)] border-t border-about-ink/15 pt-[clamp(40px,4.2vw,80px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div>
        <h3 data-animate="up" className={HEADING}>
          <Droplet className="w-[clamp(14px,1vw,19px)] shrink-0" />
          <span dir="auto">{turbines.title}</span>
        </h3>
        <p data-animate="up" className="company-copy mt-[clamp(14px,1.2vw,22px)]">
          <Lines lines={[turbines.text]} />
        </p>
        <ol className="mt-[clamp(18px,1.5vw,28px)] space-y-[clamp(10px,0.8vw,14px)]">
          {turbines.phases.map((phase, i) => (
            <li
              key={i}
              data-animate="up"
              className="company-copy border-s-[3px] border-orange ps-[clamp(14px,1vw,20px)] font-medium"
            >
              <Lines lines={[phase]} />
            </li>
          ))}
        </ol>
        <p data-animate="up" className="company-copy mt-[clamp(18px,1.5vw,28px)]">
          <Lines lines={[turbines.note]} />
        </p>
      </div>

      <div className="space-y-[clamp(32px,2.9vw,56px)]">
        {parts.map((part) => (
          <div key={part.title}>
            <h3 data-animate="up" className={HEADING}>
              <Droplet className="w-[clamp(14px,1vw,19px)] shrink-0" />
              <span dir="auto">{part.title}</span>
            </h3>
            <p data-animate="up" className="company-copy mt-[clamp(14px,1.2vw,22px)]">
              <Lines lines={[part.text]} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
