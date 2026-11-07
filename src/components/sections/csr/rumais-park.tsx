import Image from "next/image";

import { AnimatedSection } from "@/components/animations/animated-section";
import { Lines } from "@/components/ui/lines";
import { csrImages, rumaisComponentIcons } from "@/content/csr";
import type { Dictionary } from "@/i18n/get-dictionary";
import { entries } from "@/lib/utils";

import { CsrCopy, CsrPhoto } from "./csr-parts";

export function CsrRumaisPark({ dict }: { dict: Dictionary }) {
  const t = dict.csr.rumaisPark;

  return (
    <AnimatedSection
      ink="light"
      snap={false}
      className="company-band overflow-hidden pt-[clamp(56px,4.9vw,94px)] pb-[clamp(64px,5.7vw,110px)] text-white"
    >
      <div className="company-column">
        <div className="csr-row">
          <div>
            <h2 data-animate="up" className="csr-title lg:-mt-[0.42vw] lg:max-w-[30vw]">
              <span dir="auto">{t.title}</span>
            </h2>
            <div className="mt-[clamp(18px,1.3vw,25px)]">
              <CsrCopy paragraphs={t.text} className="text-white" />
            </div>
          </div>
          <CsrPhoto image={csrImages.rumaisPark} alt={t.imageAlt} />
        </div>

        <h3
          data-animate="up"
          className="mt-[clamp(36px,2.76vw,53px)] text-[clamp(18px,1.25vw,24px)] leading-[1.3] font-semibold tracking-[-0.03em] lg:tracking-[-0.05em] rtl:tracking-normal"
        >
          <span dir="auto">{t.componentsTitle}</span>
        </h3>

        <ul className="mt-[clamp(20px,1.75vw,33px)] grid gap-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-[340fr_357fr_351fr_272fr] lg:gap-x-0">
          {entries(rumaisComponentIcons).map(([key, icon]) => {
            const item = t.components[key];
            return (
              <li key={key} data-animate="up" className="csr-component lg:pe-[3vw] lg:last:pe-0">
                {/* The icon files carry 9px of empty space on each side. */}
                <span className="csr-component-icon -ms-[clamp(7px,0.47vw,9px)]">
                  <Image
                    src={icon}
                    alt=""
                    width={72}
                    height={72}
                    className="h-[clamp(56px,3.75vw,72px)] w-auto"
                  />
                </span>
                <h4 className="mt-[clamp(10px,0.8vw,15px)] text-[clamp(15px,0.94vw,18px)] leading-[1.34] font-semibold tracking-[-0.03em] rtl:tracking-normal">
                  <span dir="auto">{item.title}</span>
                </h4>
                <p className="company-copy mt-[clamp(8px,0.7vw,13px)] text-white">
                  <Lines lines={[item.text]} />
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-[clamp(32px,2.5vw,48px)] lg:pe-[0.5vw]">
          <CsrCopy paragraphs={t.more} className="text-white" />
        </div>
      </div>
    </AnimatedSection>
  );
}
