import Image from "next/image";
import Link from "next/link";

import { AnimatedSection } from "@/components/animations/animated-section";
import { Lines } from "@/components/ui/lines";
import { resolveHref } from "@/config/routes";
import { companyPlants } from "@/content/our-company";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn, entries } from "@/lib/utils";

export function Plants({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <AnimatedSection
      ink="dark"
      snap={false}
      className="bg-page-tint pt-[clamp(56px,5.3vw,102px)] pb-[clamp(64px,9.6vw,186px)] text-about-ink"
    >
      <div className="company-column flex flex-col gap-[clamp(48px,3.55vw,68px)]">
        {entries(companyPlants).map(([key, { image, href, imageEnd }]) => {
          const t = dict.ourCompany.plants[key];
          return (
            <article
              key={key}
              className={cn(
                "grid items-center gap-8 lg:gap-[clamp(40px,4vw,77px)]",
                imageEnd
                  ? "lg:grid-cols-[1fr_27.55vw] lg:gap-[clamp(40px,5.2vw,100px)]"
                  : "lg:grid-cols-[27.55vw_1fr]",
              )}
            >
              <div
                data-drift=".8"
                className={cn(
                  "relative aspect-529/575 w-full overflow-hidden",
                  imageEnd && "lg:order-last",
                )}
              >
                <Image
                  src={image}
                  alt={t.title}
                  width={525}
                  height={575}
                  sizes="(min-width: 64rem) 28vw, 100vw"
                  className="size-full object-cover"
                />
              </div>

              <div>
                <h2
                  data-animate="up"
                  className="text-page-title leading-[1.2] font-medium tracking-[-0.03em]"
                >
                  <span dir="auto">{t.title}</span>
                </h2>
                <div className="mt-[clamp(20px,2.1vw,40px)] flex flex-col gap-[1.34em] text-body">
                  {t.paragraphs.map((paragraph, i) => (
                    <p key={i} data-animate="up" className="company-copy">
                      <Lines lines={[paragraph]} />
                    </p>
                  ))}
                  <p data-animate="up" className="company-copy font-semibold">
                    <span dir="auto">{t.more}</span>{" "}
                    <Link
                      href={resolveHref(locale, href)}
                      className="text-orange-tile transition-colors hover:text-orange-dark"
                    >
                      {t.moreLink}
                    </Link>
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
