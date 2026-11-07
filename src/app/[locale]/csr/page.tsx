import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { CsrActivities } from "@/components/sections/csr/activities";
import { CsrOtherContributions } from "@/components/sections/csr/other-contributions";
import { CsrRumaisPark } from "@/components/sections/csr/rumais-park";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "csr-activities";

export async function generateMetadata({ params }: PageProps<"/[locale]/csr">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "csr",
    title: dict.labels.csr,
    description: dict.csr.hero.text[0],
    // Stays out of search results (and the sitemap) until the client confirms the open wording.
    noIndex: true,
  });
}

export default async function CsrPage({ params }: PageProps<"/[locale]/csr">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.csr.hero;

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        current={dict.labels.csr}
        titleLines={t.titleLines}
        text={t.text}
        textClassName="lg:max-w-[38.5vw]"
        nextSectionId={AFTER_HERO_ID}
      />
      <CsrActivities dict={dict} id={AFTER_HERO_ID} />
      <CsrRumaisPark dict={dict} />
      <CsrOtherContributions dict={dict} />
    </main>
  );
}
