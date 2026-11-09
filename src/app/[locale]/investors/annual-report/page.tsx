import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { LatestReport } from "@/components/sections/annual-report/latest-report";
import { ReportShelf } from "@/components/sections/annual-report/report-shelf";
import { resolveHref } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { latestReport } from "@/content/annual-reports";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "latest-report";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/investors/annual-report">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "investors/annual-report",
    title: dict.labels.annualReport,
    description: dict.annualReports.text,
    // Stays out of search results (and the sitemap) while the archive holds sample reports.
    noIndex: true,
  });
}

export default async function AnnualReportPage({
  params,
}: PageProps<"/[locale]/investors/annual-report">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.annualReports;
  const editions = siteConfig.annualReport;

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        parent={{
          label: dict.labels.investors,
          href: resolveHref(locale, { page: "investors" }),
        }}
        current={dict.labels.annualReport}
        titleLines={t.titleLines}
        text={t.text}
        nextSectionId={AFTER_HERO_ID}
      />
      <LatestReport
        id={AFTER_HERO_ID}
        year={latestReport.year}
        cover={latestReport.cover[locale]}
        href={resolveHref(locale, { document: "annualReport" })}
        otherHref={editions?.[locale === "en" ? "ar" : "en"].href}
        opensInNewTab={dict.a11y.opensInNewTab}
        copy={t}
      />
      <ReportShelf
        locale={locale}
        dict={dict}
        id="previous-reports"
        fallbackHref={resolveHref(locale, { document: "annualReport" })}
      />
    </main>
  );
}
