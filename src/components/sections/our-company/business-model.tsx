import { Factory } from "lucide-react";

import { AnimatedSection } from "@/components/animations/animated-section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Lines } from "@/components/ui/lines";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

import { StructureMotion } from "./structure-motion";

type Side = "top" | "start" | "end" | "bottom";

function Arm({
  side,
  party,
  note,
  size,
}: {
  side: Side;
  party: readonly string[];
  note: readonly string[];
  size: "lg" | "md" | "sm" | "xs";
}) {
  return (
    <div data-arm={side} className={`structure-arm structure-arm--${side}`}>
      <div data-party className={cn("structure-party", `structure-party--${size}`)}>
        {size === "lg" && <span aria-hidden className="structure-ring" />}
        <span>
          <Lines lines={party} breakFrom="always" />
        </span>
      </div>
      <span aria-hidden data-link="outer" className="structure-link" />
      <div data-note className="structure-note">
        <span>
          <Lines lines={note} />
        </span>
      </div>
      <span aria-hidden data-link="inner" className="structure-link" />
    </div>
  );
}

export function BusinessModel({ dict, id }: { dict: Dictionary; id: string }) {
  const t = dict.ourCompany.businessModel;
  const d = t.diagram;

  return (
    <AnimatedSection
      id={id}
      ink="dark"
      snap={false}
      className="overflow-hidden bg-white py-[clamp(56px,4.8vw,92px)] text-about-ink"
    >
      <div className="company-column">
        <Eyebrow data-animate="up" className="text-eyebrow">
          {t.eyebrow}
        </Eyebrow>
        <h2
          data-animate="up"
          className="mt-[clamp(16px,1.6vw,30px)] text-page-title leading-[1.2] font-medium tracking-[-0.03em]"
        >
          <span dir="auto">{t.title}</span>
        </h2>
        <p data-animate="up" className="company-copy mt-[clamp(12px,1vw,20px)]">
          <Lines lines={[t.intro]} />
        </p>

        <h3
          data-animate="up"
          className="mt-[clamp(44px,3.6vw,70px)] text-center text-about-title leading-[1.2] font-medium tracking-[-0.03em]"
        >
          <span dir="auto">{t.structureTitle}</span>
        </h3>
      </div>

      <StructureMotion className="structure mt-[clamp(28px,2.4vw,46px)]">
        <Arm side="top" party={d.stomo.party} note={d.stomo.note} size="lg" />
        <Arm side="start" party={d.gas.party} note={d.gas.note} size="sm" />
        <div data-hub className="structure-hub">
          <span data-badge className="structure-badge">
            <Factory aria-hidden strokeWidth={1.25} />
          </span>
          <Lines lines={d.hub} breakFrom="always" />
        </div>
        <Arm side="end" party={d.opwp.party} note={d.opwp.note} size="md" />
        <Arm side="bottom" party={d.lenders.party} note={d.lenders.note} size="xs" />
      </StructureMotion>

      <div className="company-column mt-[clamp(48px,4.6vw,88px)] flex flex-col gap-[clamp(14px,1.2vw,24px)]">
        {t.paragraphs.map((paragraph, i) => (
          <p key={i} data-animate="up" className="company-copy">
            <Lines lines={[paragraph]} />
          </p>
        ))}
      </div>
    </AnimatedSection>
  );
}
