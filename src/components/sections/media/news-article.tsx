import Image from "next/image";
import Link from "next/link";

import { AnimatedSection } from "@/components/animations/animated-section";
import { resolveHref } from "@/config/routes";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { NewsItem } from "@/lib/news";

import { NewsArrow, NewsCard } from "./news-card";

/**
 * One news article: the photo across the column, then the story beside a rail with
 * the date and the way back, then the other news.
 */
export function NewsArticle({
  locale,
  dict,
  item,
  others,
  id,
}: {
  locale: Locale;
  dict: Dictionary;
  item: NewsItem;
  others: readonly NewsItem[];
  id: string;
}) {
  const t = dict.mediaPage;
  const [lead, ...paragraphs] = item.body;

  return (
    <AnimatedSection
      id={id}
      ink="dark"
      snap={false}
      className="overflow-hidden bg-white pt-[clamp(40px,4.5vw,86px)] pb-[clamp(56px,6vw,115px)] text-about-ink"
    >
      <div className="company-column">
        <header className="mb-[clamp(28px,2.8vw,52px)] max-w-[1000px]">
          <h2
            data-animate="up"
            className="text-[24px] leading-[1.35] font-medium tracking-[-0.02em] text-balance text-navy rtl:leading-[1.55] rtl:tracking-normal"
          >
            <span dir="auto">{item.title}</span>
          </h2>
        </header>
        <figure
          data-animate="clip"
          data-reveal="slow"
          className="relative m-0 overflow-hidden rounded-[clamp(12px,1.1vw,20px)] bg-page-tint"
        >
          <Image
            src={item.image.src}
            width={item.image.width}
            height={item.image.height}
            alt={item.title}
            priority
            sizes="(min-width: 1280px) 70vw, 100vw"
            className="h-auto w-full"
          />
        </figure>

        <div className="mt-[clamp(36px,4vw,76px)] grid gap-[clamp(28px,4vw,80px)] lg:grid-cols-[minmax(180px,0.32fr)_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:self-start">
            {item.dateLabel && (
              <p
                data-animate="up"
                className="m-0 border-s-[3px] border-orange ps-4 text-[15px] leading-[1.5] font-semibold text-navy"
              >
                <time dateTime={item.date ?? undefined}>{item.dateLabel}</time>
              </p>
            )}
            <Link
              data-animate="up"
              href={resolveHref(locale, { page: "media" })}
              className="group mt-[clamp(24px,2.4vw,44px)] inline-flex items-center gap-3 text-[15px] font-semibold text-navy transition-colors hover:text-orange-dark max-lg:hidden"
            >
              <NewsArrow className="w-[20px] rotate-180 transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
              {t.backToMedia}
            </Link>
          </aside>

          <div className="max-w-[820px]">
            {lead ? (
              <>
                <p data-animate="up" className="m-0 text-intro leading-[1.7] font-medium text-navy">
                  <span dir="auto">{lead}</span>
                </p>
                {paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    data-animate="up"
                    className="mt-[1.3em] text-intro leading-[1.75] text-page-copy"
                  >
                    <span dir="auto">{paragraph}</span>
                  </p>
                ))}
              </>
            ) : (
              <p data-animate="up" className="m-0 text-intro text-about-muted">
                {t.noText}
              </p>
            )}
            <Link
              href={resolveHref(locale, { page: "media" })}
              className="group mt-10 inline-flex items-center gap-3 text-[15px] font-semibold text-navy lg:hidden"
            >
              <NewsArrow className="w-[20px] rotate-180" />
              {t.backToMedia}
            </Link>
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-[clamp(64px,7vw,130px)] border-t border-media-rule pt-[clamp(32px,2.6vw,50px)]">
            <h2 data-animate="up" className="text-[clamp(22px,1.6vw,30px)] font-semibold text-navy">
              {t.moreNews}
            </h2>
            <ul className="mt-[clamp(24px,2.2vw,42px)] grid gap-x-[clamp(20px,1.8vw,34px)] gap-y-[clamp(36px,3vw,56px)] sm:grid-cols-2 lg:grid-cols-3">
              {others.slice(0, 3).map((other) => (
                <li key={other.slug} data-animate="up">
                  <NewsCard item={other} href={resolveHref(locale, { news: other.slug })} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
