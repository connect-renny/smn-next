import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

type PageMetaOptions = {
  /** Path after the locale, without leading slash ("" for home). */
  path: string;
  title?: string;
  description?: string;
  noIndex?: boolean;
};

/** Canonical + hreflang alternates + Open Graph for one localised page. */
export function pageMetadata(locale: Locale, dict: Dictionary, options: PageMetaOptions): Metadata {
  const suffix = options.path ? `/${options.path}` : "";
  const description = options.description ?? dict.meta.description;
  const title = options.title ?? `${dict.meta.title} — ${dict.meta.tagline}`;

  return {
    title: options.title ? options.title : { absolute: title },
    description,
    alternates: {
      canonical: `/${locale}${suffix}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, `/${l}${suffix}`])),
        "x-default": `/en${suffix}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
      url: `/${locale}${suffix}`,
      title,
      description,
      images: [
        {
          url: "/images/home/hero-video-poster.jpg",
          width: 1920,
          height: 980,
          alt: dict.meta.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/home/hero-video-poster.jpg"],
    },
    robots: options.noIndex ? { index: false, follow: true } : undefined,
  };
}

export const metadataBase = new URL(siteConfig.url);
