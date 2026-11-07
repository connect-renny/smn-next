import { AnimatedSection } from "@/components/animations/animated-section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Lines } from "@/components/ui/lines";
import { csrImages } from "@/content/csr";
import type { Dictionary } from "@/i18n/get-dictionary";

import { CsrCopy, CsrPhoto } from "./csr-parts";

/** A title over its paragraphs. */
function Initiative({ title, text }: { title: string; text: readonly string[] }) {
  return (
    <div>
      <h3 data-animate="up" className="csr-title lg:max-w-[30vw]">
        <span dir="auto">{title}</span>
      </h3>
      <div className="mt-[clamp(18px,1.9vw,36px)]">
        <CsrCopy paragraphs={text} />
      </div>
    </div>
  );
}

export function CsrActivities({ dict, id }: { dict: Dictionary; id: string }) {
  const t = dict.csr.activities;

  return (
    <AnimatedSection
      id={id}
      ink="dark"
      snap={false}
      className="overflow-hidden bg-white pt-[clamp(56px,4.7vw,90px)] pb-[clamp(64px,6.8vw,130px)] text-about-ink"
    >
      <div className="company-column">
        <Eyebrow data-animate="up" className="text-eyebrow">
          {t.eyebrow}
        </Eyebrow>
        <h2
          data-animate="up"
          className="mt-[clamp(16px,1.3vw,25px)] text-page-title leading-[1.2] font-medium tracking-[-0.03em] lg:tracking-[-0.05em] rtl:leading-[1.4] rtl:tracking-normal"
        >
          <span dir="auto">{t.title}</span>
        </h2>
        <p data-animate="up" className="company-copy mt-[clamp(10px,0.8vw,15px)] font-medium">
          <Lines lines={[t.intro]} />
        </p>

        <div className="csr-row mt-[clamp(40px,5.7vw,110px)]">
          <CsrPhoto image={csrImages.donating} alt={t.donating.imageAlt} />
          <Initiative title={t.donating.title} text={t.donating.text} />
        </div>

        <div className="csr-row mt-[clamp(48px,3.55vw,68px)]">
          <Initiative title={t.hackathon.title} text={t.hackathon.text} />
          <CsrPhoto image={csrImages.hackathon} alt={t.hackathon.imageAlt} />
        </div>

        <div className="mt-[clamp(24px,4vw,77px)]">
          <CsrCopy paragraphs={t.hackathon.more} />
        </div>

        <div className="csr-row mt-[clamp(48px,5.2vw,100px)]">
          <CsrPhoto image={csrImages.craftVillage} alt={t.craftVillage.imageAlt} />
          <Initiative title={t.craftVillage.title} text={t.craftVillage.text} />
        </div>
      </div>
    </AnimatedSection>
  );
}
