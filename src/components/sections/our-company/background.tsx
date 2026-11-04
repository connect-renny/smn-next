import { Factory, Handshake, PieChart } from "lucide-react";

import { AnimatedSection } from "@/components/animations/animated-section";
import { Lines } from "@/components/ui/lines";
import type { Dictionary } from "@/i18n/get-dictionary";

import { BackgroundMotion } from "./background-motion";

const columns = {
  tender: { Icon: Factory, disc: "bg-diagram-orange" },
  award: { Icon: Handshake, disc: "bg-diagram-green" },
  holding: { Icon: PieChart, disc: "bg-diagram-navy" },
} as const;

export function Background({ dict }: { dict: Dictionary }) {
  const t = dict.ourCompany.background;

  return (
    <AnimatedSection
      ink="light"
      snap={false}
      className="company-band pt-[clamp(56px,5.2vw,100px)] pb-[clamp(64px,8.6vw,166px)] text-white"
    >
      <div className="company-column">
        <h2
          data-animate="up"
          className="text-page-title leading-[1.2] font-medium tracking-[-0.03em]"
        >
          <span dir="auto">{t.title}</span>
        </h2>

        <BackgroundMotion className="mt-[clamp(28px,3vw,58px)] grid gap-10 lg:grid-cols-[367fr_430fr_408fr] lg:gap-x-[3.2vw]">
          {(Object.keys(columns) as (keyof typeof columns)[]).map((key) => {
            const { Icon, disc } = columns[key];
            const item = t.items[key];
            return (
              <div key={key} data-bg-column>
                <div className="flex items-center gap-[clamp(8px,0.58vw,11px)]">
                  <span
                    data-bg-icon
                    className={`grid size-[clamp(44px,2.76vw,53px)] shrink-0 place-items-center rounded-full ${disc}`}
                  >
                    <Icon aria-hidden className="size-[46%]" strokeWidth={2.25} />
                  </span>
                  <span aria-hidden data-bg-rule className="company-band-rule" />
                </div>
                <p
                  data-bg-text
                  className="company-copy mt-[clamp(20px,1.9vw,36px)] text-white lg:pe-[1vw]"
                >
                  <Lines lines={[item.text]} />
                </p>
                {"note" in item && (
                  <p
                    data-bg-text
                    className="company-copy mt-[clamp(14px,1.25vw,24px)] font-medium text-white"
                  >
                    <Lines lines={[item.note]} />
                  </p>
                )}
              </div>
            );
          })}
        </BackgroundMotion>
      </div>
    </AnimatedSection>
  );
}
