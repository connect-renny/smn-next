import Image from "next/image";
import Link from "next/link";

import { AnimatedSection } from "@/components/animations/animated-section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { resolveHref } from "@/config/routes";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { NewsItem } from "@/lib/news";

import { NewsArrow, NewsCard } from "./news-card";

/**
 * Every news item: the newest as a wide feature (photo beside its title and the
 * start of its story), then the rest in a grid of cards.
 */
export function MediaList({
  locale,
  dict,
  items,
  id,
}: {
  locale: Locale;
  dict: Dictionary;
  items: readonly NewsItem[];
  id: string;
}) {
  const t = dict.mediaPage;
  const [latest, ...rest] = items;
  if (!latest) return null;
  const href = (item: NewsItem) => resolveHref(locale, { news: item.slug });

  return (
    <AnimatedSection
      id={id}
      ink="dark"
      snap={false}
      className="overflow-hidden bg-white py-[clamp(56px,6vw,115px)] text-about-ink"
    >
      <div className="company-column">
        <Link
          href={href(latest)}
          className="news-feature group grid items-center gap-[clamp(24px,3.6vw,70px)] text-inherit lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
        >
          <div
            data-animate="clip"
            data-reveal="slow"
            className="relative aspect-[1000/560] overflow-hidden rounded-[clamp(12px,1vw,20px)] bg-page-tint"
          >
            <Image
              src={latest.image.src}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="news-card-img object-cover"
            />
            <span className="absolute start-[clamp(14px,1.2vw,24px)] top-[clamp(14px,1.2vw,24px)] rounded-full bg-orange px-[14px] py-[6px] text-[12px] font-semibold tracking-[0.08em] text-white uppercase rtl:tracking-normal">
              {t.latest}
            </span>
          </div>

          <div>
            {latest.dateLabel && (
              <Eyebrow data-animate="up" className="text-eyebrow text-orange">
                {latest.dateLabel}
              </Eyebrow>
            )}
            <h2
              data-animate="up"
              className="mt-[clamp(14px,1.3vw,24px)] text-[20px] leading-[1.4] font-medium tracking-[-0.02em] text-navy transition-colors duration-300 group-hover:text-orange-dark rtl:leading-[1.5] rtl:tracking-normal"
            >
              <span dir="auto">{latest.title}</span>
            </h2>
            {latest.body[0] && (
              <p
                data-animate="up"
                className="mt-[clamp(14px,1.3vw,24px)] line-clamp-3 text-intro text-page-copy"
              >
                <span dir="auto">{latest.body[0]}</span>
              </p>
            )}
            <span
              data-animate="up"
              className="mt-[clamp(22px,2vw,38px)] inline-flex items-center gap-3 text-[15px] font-semibold text-navy"
            >
              <span className="news-more-dot grid size-[46px] place-items-center rounded-full border border-navy/25 transition-colors duration-300 group-hover:border-orange group-hover:bg-orange group-hover:text-white">
                <NewsArrow className="news-card-arrow w-[18px]" />
              </span>
              {t.readMore}
            </span>
          </div>
        </Link>

        {rest.length > 0 && (
          <>
            <div
              data-animate="up"
              className="mt-[clamp(56px,6vw,110px)] flex items-center gap-6 border-t border-media-rule pt-[clamp(28px,2.4vw,44px)]"
            >
              <h2 className="text-[clamp(22px,1.6vw,30px)] font-semibold text-navy">{t.allNews}</h2>
            </div>
            <ul className="mt-[clamp(24px,2.2vw,42px)] grid gap-x-[clamp(20px,1.8vw,34px)] gap-y-[clamp(36px,3vw,56px)] sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((item) => (
                <li key={item.slug} data-animate="up">
                  <NewsCard item={item} href={href(item)} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </AnimatedSection>
  );
}
