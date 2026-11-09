import Image from "next/image";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HeroIntro } from "@/components/sections/hero/hero-intro";
import { CompanyHeroMark } from "@/components/sections/our-company/company-hero-mark";
import { Lines } from "@/components/ui/lines";
import { resolveHref } from "@/config/routes";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

type InnerHeroProps = {
  locale: Locale;
  dict: Dictionary;
  /** The menu group this page sits under, if any; the page itself closes the trail. */
  parent?: { label: string; href?: string };
  current: string;
  titleLines: readonly string[];
  /** One paragraph, or several. */
  text?: string | readonly string[];
  textClassName?: string;
  nextSectionId: string;
  /** Anything the comp adds under the text, such as a row of stats. */
  children?: React.ReactNode;
};

/** The navy-to-green opening of an inner page, with the SMN mark cropped by the end edge. */
export function InnerHero({
  locale,
  dict,
  parent,
  current,
  titleLines,
  text,
  textClassName,
  nextSectionId,
  children,
}: InnerHeroProps) {
  const paragraphs = text === undefined ? [] : typeof text === "string" ? [text] : text;

  return (
    <section className="company-hero section-fit text-white">
      <CompanyHeroMark />

      <HeroIntro className="relative z-1 flex min-h-0 flex-1 flex-col pt-[calc(var(--header-h)+clamp(32px,8vw,155px))] pb-[clamp(48px,7.5vw,144px)]">
        <div className="w-full px-5 sm:px-10 lg:ps-[clamp(48px,15.68vw,301px)] lg:pe-[24vw]">
          <Breadcrumbs
            data-hero-fade
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.a11y.home, href: resolveHref(locale, { section: "home" }) },
              ...(parent ? [parent] : []),
              { label: current },
            ]}
          />

          <h1 className="mt-[clamp(14px,1.35vw,26px)] text-hero leading-[0.92] font-light tracking-[-0.015em] max-lg:leading-[1.02] rtl:tracking-normal">
            {titleLines.map((line, i) => (
              <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.2em]">
                <span data-hero-line className="block">
                  <Lines lines={[line]} />
                </span>
              </span>
            ))}
          </h1>

          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              data-hero-fade
              className={cn(
                "max-w-[840px] text-intro lg:max-w-[42vw]",
                i === 0 ? "mt-title" : "mt-[1.34em]",
                textClassName,
              )}
            >
              <Lines lines={[paragraph]} />
            </p>
          ))}

          {children}
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
