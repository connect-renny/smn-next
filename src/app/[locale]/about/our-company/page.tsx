import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExploreFurther } from "@/components/sections/explore-further";
import { Background } from "@/components/sections/our-company/background";
import { BusinessModel } from "@/components/sections/our-company/business-model";
import { CompanyHero } from "@/components/sections/our-company/company-hero";
import { OmanMap } from "@/components/sections/our-company/oman-map";
import { Plants } from "@/components/sections/our-company/plants";
import { companyExploreLinks } from "@/content/our-company";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";
import { entries } from "@/lib/utils";

const AFTER_HERO_ID = "company-content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about/our-company">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "about/our-company",
    title: dict.labels.ourCompany,
    description: dict.ourCompany.text,
    // Stays out of search results (and the sitemap) until every section is in.
    noIndex: true,
  });
}

export default async function OurCompanyPage({ params }: PageProps<"/[locale]/about/our-company">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main">
      <CompanyHero locale={locale} dict={dict} nextSectionId={AFTER_HERO_ID} />
      <BusinessModel dict={dict} id={AFTER_HERO_ID} />
      <Background dict={dict} />
      <Plants locale={locale} dict={dict} />
      <OmanMap dict={dict} />
      <ExploreFurther
        locale={locale}
        title={dict.ourCompany.explore.title}
        links={entries(companyExploreLinks).map(([key, link]) => ({
          ...link,
          label: dict.ourCompany.explore.links[key],
        }))}
      />
    </main>
  );
}
