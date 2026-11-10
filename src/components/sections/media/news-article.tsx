import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AnimatedSection } from "@/components/animations/animated-section";
import { BrandIcon } from "@/components/ui/brand-icons";
import { resolveHref } from "@/config/routes";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { NewsItem } from "@/lib/news";

import { NewsArrow, NewsCard } from "./news-card";

const LINKEDIN = (
  <path
    fill="currentColor"
    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"
  />
);
const WHATSAPP = (
  <path
    fill="currentColor"
    d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.5 9.5 0 0 1-4.84-1.32l-.35-.21-3.6.94.96-3.5-.23-.36a9.45 9.45 0 0 1-1.45-5.05c0-5.23 4.26-9.49 9.5-9.49a9.5 9.5 0 0 1 9.49 9.5c0 5.23-4.26 9.49-9.47 9.49Zm8.08-17.57A11.35 11.35 0 0 0 12.05.5C5.76.5.64 5.62.64 11.9c0 2.01.52 3.97 1.52 5.7L.54 23.5l6.03-1.58a11.37 11.37 0 0 0 5.47 1.4h.01c6.29 0 11.41-5.12 11.41-11.41 0-3.05-1.19-5.91-3.33-8.07Z"
  />
);

/**
 * One news article: the photo across the column, then the story beside a rail with
 * the date, share links and the way back, then the other news.
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
  const url = `${siteConfig.url}${resolveHref(locale, { news: item.slug })}`;
  const share = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden className="size-[17px]">
          {LINKEDIN}
        </svg>
      ),
    },
    {
      label: "X",
      href: `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(item.title)}`,
      icon: <BrandIcon network="x" className="size-[15px]" />,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${item.title} ${url}`)}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden className="size-[18px]">
          {WHATSAPP}
        </svg>
      ),
    },
    {
      label: t.email,
      href: `mailto:?subject=${encodeURIComponent(item.title)}&body=${encodeURIComponent(url)}`,
      icon: <Mail aria-hidden className="size-[18px]" strokeWidth={1.8} />,
    },
  ];
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
          className="relative m-0 overflow-hidden rounded-[clamp(12px,1vw,20px)] bg-page-tint"
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
            <div data-animate="up" className="flex flex-wrap items-center gap-x-8 gap-y-6 lg:block">
              {item.dateLabel && (
                <p className="m-0 border-s-[3px] border-orange ps-4 text-[15px] leading-[1.5] font-semibold text-navy">
                  <time dateTime={item.date ?? undefined}>{item.dateLabel}</time>
                </p>
              )}
              <div className="lg:mt-[clamp(28px,2.4vw,44px)]">
                <p className="m-0 text-[12px] font-semibold tracking-[0.12em] text-about-muted uppercase rtl:tracking-normal">
                  {t.share}
                </p>
                <ul className="mt-3 flex gap-2">
                  {share.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t.shareOn.replace("{network}", s.label)}
                        className="grid size-[42px] place-items-center rounded-full border border-navy/15 text-navy transition-[background-color,border-color,color,translate] duration-300 hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-white"
                      >
                        {s.icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
