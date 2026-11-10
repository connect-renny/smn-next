import Image from "next/image";

import { AnimatedSection } from "@/components/animations/animated-section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Lines } from "@/components/ui/lines";
import { philosophyImage } from "@/content/companys-philosophy";
import type { Dictionary } from "@/i18n/get-dictionary";

/** Screen 02: the governance framework text beside the stacked-hands photo. */
export function GovernanceFramework({ dict, id }: { dict: Dictionary; id: string }) {
  const t = dict.companysPhilosophy.framework;

  return (
    <AnimatedSection
      id={id}
      ink="dark"
      snap={false}
      className="overflow-hidden bg-white pt-[clamp(56px,4.5vw,86px)] pb-[clamp(56px,6vw,115px)] text-about-ink"
    >
      <div className="company-column">
        <div className="grid items-start gap-[clamp(32px,5.5vw,104px)] lg:grid-cols-[minmax(0,1fr)_min(27.4vw,525px)]">
          <div>
            <Eyebrow data-animate="up" className="text-eyebrow">
              {t.eyebrow}
            </Eyebrow>
            <h2
              data-animate="up"
              className="mt-[clamp(16px,2.3vw,44px)] text-page-title leading-[1.05] font-medium tracking-[-0.03em] lg:tracking-[-0.05em] rtl:leading-[1.4] rtl:tracking-normal"
            >
              <span dir="auto">{t.title}</span>
            </h2>
            <div className="mt-[clamp(20px,2.3vw,44px)] space-y-[1.34em] lg:max-w-[min(36vw,690px)]">
              {t.paragraphs.map((paragraph, i) => (
                <p key={i} data-animate="up" className="company-copy font-medium">
                  <Lines lines={[paragraph]} />
                </p>
              ))}
            </div>
          </div>

          <div data-animate="clip" data-reveal="slow" className="lg:mt-[clamp(0px,1.9vw,36px)]">
            <Image
              {...philosophyImage}
              alt={t.imageAlt}
              sizes="(min-width: 1024px) 28vw, 100vw"
              className="h-auto w-full rounded-[12px] max-lg:mx-auto max-lg:max-w-[525px]"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
