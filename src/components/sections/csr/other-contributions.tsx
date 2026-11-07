import { AnimatedSection } from "@/components/animations/animated-section";
import { csrImages } from "@/content/csr";
import type { Dictionary } from "@/i18n/get-dictionary";

import { CsrCopy, CsrPhoto } from "./csr-parts";

export function CsrOtherContributions({ dict }: { dict: Dictionary }) {
  const t = dict.csr.otherContributions;

  return (
    <AnimatedSection
      ink="dark"
      snap={false}
      className="csr-other relative overflow-hidden bg-white pt-[clamp(56px,4.85vw,93px)] pb-[clamp(64px,7vw,134px)] text-about-ink"
    >
      <div className="company-column relative">
        {/* Reading order on a phone: title, award, story, then the photos. */}
        <div className="grid gap-x-[clamp(24px,2.92vw,56px)] gap-y-[clamp(24px,1.77vw,34px)] lg:grid-cols-2">
          <div className="lg:col-start-2 lg:row-start-1">
            <h2 data-animate="up" className="csr-title lg:-mt-[0.42vw] lg:max-w-[30vw]">
              <span dir="auto">{t.title}</span>
            </h2>
            <div className="mt-[clamp(18px,2.1vw,41px)]">
              <CsrPhoto image={csrImages.awards} alt={t.awardsImageAlt} className="lg:w-[74%]" />
            </div>
          </div>

          <div className="relative lg:col-start-2 lg:row-start-2">
            <div
              data-lenis-prevent
              tabIndex={0}
              role="region"
              aria-label={t.title}
              className="csr-scroll"
            >
              <CsrCopy paragraphs={t.text} />
            </div>
          </div>

          <div className="lg:col-start-1 lg:row-start-1">
            <CsrPhoto
              image={csrImages.agreementStanding}
              alt={t.agreementStandingImageAlt}
              imageClassName="lg:aspect-[630/412] lg:object-cover"
            />
          </div>
          <div className="lg:col-start-1 lg:row-start-2">
            <CsrPhoto image={csrImages.agreementSigning} alt={t.agreementSigningImageAlt} />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
