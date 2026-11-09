import Image from "next/image";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HeroIntro } from "@/components/sections/hero/hero-intro";
import { Lines } from "@/components/ui/lines";
import { resolveHref } from "@/config/routes";
import { companyHeroFacts } from "@/content/our-company";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { entries } from "@/lib/utils";

import { CompanyHeroMark } from "./company-hero-mark";

type CompanyHeroProps = { locale: Locale; dict: Dictionary; nextSectionId: string };

export function CompanyHero({ locale, dict, nextSectionId }: CompanyHeroProps) {
  const t = dict.ourCompany;

  return (
    <section className="company-hero section-fit text-white">
      <CompanyHeroMark />

      <HeroIntro className="relative z-1 flex min-h-0 flex-1 flex-col justify-center pt-[calc(var(--header-h)+clamp(32px,7.7vw,148px))] pb-[clamp(48px,5.4vw,104px)]">
        <div className="w-full px-5 sm:px-10 lg:ps-[clamp(48px,15.68vw,301px)] lg:pe-[24vw]">
          <Breadcrumbs
            data-hero-fade
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.a11y.home, href: resolveHref(locale, { section: "home" }) },
              { label: dict.labels.aboutUs },
            ]}
          />

          <h1 className="mt-[clamp(14px,1.35vw,26px)] text-hero leading-[0.92] font-light tracking-[-0.015em] whitespace-nowrap max-lg:leading-[1.02] max-sm:whitespace-normal">
            {t.titleLines.map((line, i) => (
              // Extra bottom room (pulled back with a negative margin) so descenders
              // like "g" aren't clipped by the reveal mask; line spacing is unchanged.
              <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.2em]">
                <span data-hero-line className="block">
                  <Lines lines={[line]} />
                </span>
              </span>
            ))}
          </h1>

          <p data-hero-fade className="mt-title max-w-[840px] text-intro lg:max-w-[44vw]">
            <Lines lines={[t.text]} />
          </p>

          <dl className="mt-[clamp(36px,4.7vw,90px)] grid gap-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0 lg:w-fit lg:grid-cols-[14.65vw_16.46vw_auto] lg:gap-x-0">
            {entries(companyHeroFacts).map(([key, { icon }]) => {
              const fact = dict.about.facts[key];
              return (
                <div
                  key={key}
                  data-hero-fade
                  className="flex flex-col items-start sm:not-last:border-e sm:not-last:border-white/30 lg:not-first:ps-[1.85vw]"
                >
                  <Image
                    src={icon}
                    alt=""
                    width={90}
                    height={90}
                    className="mb-[clamp(12px,1vw,19px)] h-[clamp(60px,4.69vw,90px)] w-auto"
                  />
                  <dt className="text-lead leading-[1.3] tracking-[-0.02em]">{fact.label}</dt>
                  <dd
                    dir="auto"
                    className="text-hero-fact leading-[1.3] font-semibold tracking-[-0.04em] whitespace-nowrap"
                  >
                    {fact.value}
                    {fact.unit && ` ${fact.unit}`}
                  </dd>
                  <dd className="text-lead leading-[1.3] tracking-[-0.02em]">{fact.sub}</dd>
                </div>
              );
            })}
          </dl>
        </div>

        <a
          href={`#${nextSectionId}`}
          aria-label={dict.a11y.scrollDown}
          className="scroll-cue max-lg:hidden"
          data-hero-fade
        >
          <span className="scroll-cue-track">
            <Image src="/images/home/hero-arrow.png" alt="" width={10} height={37} />
          </span>
        </a>
      </HeroIntro>
    </section>
  );
}
