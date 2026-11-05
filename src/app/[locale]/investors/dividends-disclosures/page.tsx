import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { DividendsSection } from "@/components/sections/dividends/dividends-section";
import { resolveHref } from "@/config/routes";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "dividends";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/investors/dividends-disclosures">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "investors/dividends-disclosures",
    title: dict.labels.dividendsDisclosures,
    description: dict.dividends.text,
    // Stays out of search results (and the sitemap) until there is an approved design.
    noIndex: true,
  });
}

export default async function DividendsDisclosuresPage({
  params,
}: PageProps<"/[locale]/investors/dividends-disclosures">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        parent={{
          label: dict.labels.investors,
          href: resolveHref(locale, { page: "investors" }),
        }}
        current={dict.labels.dividendsDisclosures}
        titleLines={dict.dividends.titleLines}
        text={dict.dividends.text}
        nextSectionId={AFTER_HERO_ID}
      />
      <DividendsSection dict={dict} id={AFTER_HERO_ID} />
    </main>
  );
}
