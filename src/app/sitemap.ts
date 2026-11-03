import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { localeMeta, locales } from "@/i18n/config";

/**
 * Only real content is listed. The "Coming soon" inner pages are noindex and
 * should be added here as each one is published.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((l) => [localeMeta[l].htmlLang, `${siteConfig.url}/${l}`]),
  );

  return locales.map((locale) => ({
    url: `${siteConfig.url}/${locale}`,
    changeFrequency: "weekly",
    priority: 1,
    alternates: { languages },
  }));
}
