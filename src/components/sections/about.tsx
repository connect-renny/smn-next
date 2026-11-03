import Image from "next/image";
import Link from "next/link";

import { resolveHref } from "@/config/routes";
import { aboutFacts, aboutMoreHref, sectionVideos } from "@/content/home";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { AnimatedSection } from "@/components/animations/animated-section";
import { BackgroundVideo } from "@/components/animations/background-video";
import { CountUp } from "@/components/animations/count-up";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Lines } from "@/components/ui/lines";
import { entries } from "@/lib/utils";

type AboutProps = { locale: Locale; dict: Dictionary };

export function About({ locale, dict }: AboutProps) {
  const t = dict.about;

  return (
    <AnimatedSection id="about" ink="dark" className="section-fit bg-white text-about-ink">
      {/* Portrait render on the end edge, feathered into the white. */}
      <div className="absolute inset-y-0 end-0 z-0 w-1/2 opacity-35 sm:w-[clamp(232px,20vw,390px)] lg:w-[clamp(200px,16vw,312px)] lg:opacity-100">
        <BackgroundVideo src={sectionVideos.about} />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-white via-white/72 via-14% to-transparent to-34% rtl:bg-linear-to-l"
        />
      </div>

      <div className="relative z-1 flex min-h-0 flex-1 flex-col justify-center py-section-y lg:pt-0 lg:pb-[5.1vh]">
        <div className="w-full px-5 sm:px-10 lg:ps-[clamp(48px,15.68vw,301px)] lg:pe-8">
          <Eyebrow data-animate="up" className="text-eyebrow-lg tracking-[0.01em] text-about-ink">
            {t.eyebrow}
          </Eyebrow>

          <h2
            data-animate="up"
            className="mt-[clamp(20px,1.51vw,29px)] text-about-title leading-[1.315] font-medium tracking-[-0.005em] lg:max-w-[55vw]"
          >
            <Lines lines={t.titleLines} />
          </h2>

          <p
            data-animate="up"
            className="mt-copy text-body leading-[1.4] text-about-muted lg:max-w-[48vw] lg:leading-[1.25]"
          >
            {t.text}
          </p>

          <div data-animate="up" className="mt-[clamp(26px,2.08vw,40px)]">
            <Link
              href={resolveHref(locale, aboutMoreHref)}
              aria-label={t.moreLabel}
              className="btn-plus"
            />
          </div>

          <dl
            data-animate="up"
            className="mt-[clamp(40px,3.12vw,60px)] grid gap-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 lg:grid-cols-[repeat(3,clamp(200px,14.48vw,278px))] lg:gap-x-[clamp(34px,2.97vw,57px)]"
          >
            {entries(aboutFacts).map(([key, { icon }]) => {
              const fact = t.facts[key];
              return (
                <div
                  key={key}
                  className="group flex flex-col items-start text-fact-ink sm:pe-4 sm:not-last:border-e sm:not-last:border-fact-rule lg:pe-0"
                >
                  <Image
                    src={icon}
                    alt=""
                    width={90}
                    height={90}
                    className="mb-[clamp(16px,1.23vw,24px)] h-[clamp(56px,4.69vw,90px)] w-auto origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-safe:group-hover:-translate-y-1.5 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6 rtl:motion-safe:group-hover:rotate-6"
                  />
                  <dt className="text-fact-label leading-[1.2]">{fact.label}</dt>
                  <dd className="flex items-baseline gap-[clamp(10px,1.04vw,20px)] text-fact-value leading-[1.15] font-bold whitespace-nowrap">
                    <CountUp value={fact.value} />
                    {fact.unit && (
                      <em className="text-fact-unit font-medium not-italic">{fact.unit}</em>
                    )}
                  </dd>
                  <dd className="mt-0.5 text-fact-label leading-[1.4]">{fact.sub}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </AnimatedSection>
  );
}
