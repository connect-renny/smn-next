import { resolveHref } from "@/config/routes";
import { newsItems } from "@/content/home";
import { localeMeta, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { AnimatedSection } from "@/components/animations/animated-section";
import { Eyebrow } from "@/components/ui/eyebrow";

import { MediaCarousel, type MediaCard } from "./media-carousel";

type MediaCentreProps = { locale: Locale; dict: Dictionary };

export function MediaCentre({ locale, dict }: MediaCentreProps) {
  const t = dict.media;
  const cards: MediaCard[] = newsItems.map((item) => ({
    title: dict.labels[item.key],
    date: t.dates[item.key],
    image: item.image,
    href: resolveHref(locale, item.href),
  }));

  return (
    <AnimatedSection
      id="media"
      ink="dark"
      className="section-fit justify-center bg-white py-section-y text-about-ink lg:pt-0 lg:pb-[8.13vh]"
    >
      <div className="shell">
        <MediaCarousel
          dir={localeMeta[locale].dir}
          label={t.eyebrow}
          // The loop needs more slides than fit in view, so the set repeats (as in the demo).
          cards={[...cards, ...cards]}
          labels={{ previous: dict.a11y.previousUpdates, next: dict.a11y.nextUpdates }}
          heading={
            <div>
              <Eyebrow data-animate="up" className="text-eyebrow tracking-[0.05em]">
                {t.eyebrow}
              </Eyebrow>
              <h2
                data-animate="up"
                className="mt-[clamp(16px,1.61vw,31px)] text-media-title leading-[1.1] font-semibold"
              >
                {t.title}
              </h2>
            </div>
          }
        />
      </div>
    </AnimatedSection>
  );
}
