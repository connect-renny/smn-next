import Image from "next/image";
import Link from "next/link";

import { resolveHref } from "@/config/routes";
import { governanceCells, sectionVideos } from "@/content/home";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { AnimatedSection } from "@/components/animations/animated-section";
import { BackgroundVideo } from "@/components/animations/background-video";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Lines } from "@/components/ui/lines";
import { entries } from "@/lib/utils";

type GovernanceProps = { locale: Locale; dict: Dictionary };

export function Governance({ locale, dict }: GovernanceProps) {
  const t = dict.governance;

  return (
    <AnimatedSection
      id="governance"
      ink="dark"
      className="section-fit items-center justify-center bg-white py-section-y text-about-ink lg:pt-0 lg:pb-[5.9vh]"
    >
      {/* Same render as About, mirrored and bleeding off the start edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 start-0 z-0 w-[clamp(190px,25vw,496px)] overflow-hidden max-md:hidden lg:w-[clamp(160px,20vw,397px)]"
      >
        <BackgroundVideo
          src={sectionVideos.about}
          className="-scale-x-140 scale-y-140 rtl:scale-x-140"
        />
        <span className="absolute inset-0 bg-linear-to-r from-white/0 from-38% via-white/85 via-78% to-white rtl:bg-linear-to-l" />
      </div>

      <div className="relative z-1 px-5 text-center">
        <Eyebrow data-animate="up" variant="hanging" className="text-eyebrow tracking-[0.05em]">
          {t.eyebrow}
        </Eyebrow>
        <h2
          data-animate="up"
          className="mt-[clamp(14px,1.15vw,22px)] text-section-title leading-[1.1] font-medium"
        >
          {t.title}
        </h2>
      </div>

      <div className="relative z-1 shell mt-block-gap">
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {entries(governanceCells).map(([key, cell]) => {
            const copy = t.cells[key];
            return [
              <figure
                key={`fig-${key}`}
                data-animate="clip-start"
                data-parallax
                className="relative m-0 aspect-[440/238] overflow-hidden max-sm:aspect-square"
              >
                <Image
                  src={cell.image}
                  alt={copy.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 23vw, 50vw"
                  className="object-cover grayscale"
                />
              </figure>,
              <Link
                key={`tile-${key}`}
                href={resolveHref(locale, cell.href)}
                aria-label={copy.moreLabel}
                className="gov-tile relative flex aspect-[440/238] flex-col items-start overflow-hidden bg-orange-tile p-4 text-white max-sm:aspect-square sm:p-6 lg:ps-[3.28vw] lg:pe-[1.5vw] lg:pt-[3.18vw] lg:pb-0"
              >
                <h3 className="gov-tile-title m-0 text-gov-tile leading-[1.06] font-semibold">
                  <Lines lines={copy.titleLines} breakFrom="always" />
                </h3>
                <span aria-hidden className="btn-plus btn-plus--dark mt-[clamp(12px,1.2vw,23px)]" />
              </Link>,
            ];
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
