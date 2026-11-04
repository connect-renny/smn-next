import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { AnimatedSection } from "@/components/animations/animated-section";
import { Droplet } from "@/components/ui/droplet";
import { resolveHref } from "@/config/routes";
import { companyExploreLinks } from "@/content/our-company";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { entries } from "@/lib/utils";

export function ExploreFurther({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.ourCompany.explore;
  return (
    <AnimatedSection
      ink="dark"
      snap={false}
      className="bg-white py-[clamp(48px,4.7vw,90px)] text-about-ink"
    >
      <div className="company-column">
        <h2
          data-animate="up"
          className="text-[clamp(20px,1.36vw,26px)] font-medium tracking-[-0.03em] rtl:tracking-normal"
        >
          {t.title}
        </h2>
        <ul className="mt-[clamp(20px,1.7vw,32px)] grid gap-4 md:grid-cols-2 md:gap-[clamp(20px,2.5vw,48px)]">
          {entries(companyExploreLinks).map(([key, { image, href }], i) => (
            <li key={key} data-animate="up">
              <Link
                href={resolveHref(locale, href)}
                className="group relative block h-[clamp(96px,5.75vw,110px)] overflow-hidden rounded-[12px] text-white"
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 48rem) 34vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 rtl:-scale-x-100 rtl:group-hover:-scale-x-105"
                />
                <span className="absolute start-[1.1em] top-[1.05em] text-[clamp(11px,0.63vw,12px)] font-medium">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute inset-y-0 start-[clamp(40px,3.5vw,66px)] end-20 flex items-center gap-[clamp(12px,1vw,19px)]">
                  <Droplet className="w-[clamp(18px,1.25vw,24px)] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-110" />
                  <span className="text-[clamp(13px,0.84vw,16px)] font-semibold uppercase">
                    {t.links[key]}
                  </span>
                </span>
                <span className="absolute end-[clamp(16px,1.3vw,25px)] top-1/2 grid size-[clamp(30px,1.85vw,35px)] -translate-y-1/2 place-items-center rounded-full bg-orange text-white transition-transform duration-500 group-hover:rotate-90">
                  <Plus className="size-1/2" aria-hidden strokeWidth={2.4} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
}
