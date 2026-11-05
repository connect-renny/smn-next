import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/components/animations/animated-section";
import { InnerHero } from "@/components/layout/inner-hero";
import { TendersBoard } from "@/components/sections/tenders/tenders-board";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "tender-board";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/tenders">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "tenders",
    title: dict.labels.tenders,
    description: dict.tenders.text,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function TendersPage({ params }: PageProps<"/[locale]/tenders">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        current={dict.labels.tenders}
        titleLines={dict.tenders.titleLines}
        text={dict.tenders.text}
        nextSectionId={AFTER_HERO_ID}
      />
      <AnimatedSection
        id={AFTER_HERO_ID}
        ink="dark"
        snap={false}
        className="scroll-mt-(--header-h) bg-page-tint py-[clamp(48px,5.2vw,100px)] text-about-ink"
      >
        <TendersBoard copy={dict.tenders} locale={locale} />
      </AnimatedSection>
    </main>
  );
}
