import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuickLinks } from "@/components/layout/quick-links";
import { About } from "@/components/sections/about";
import { Governance } from "@/components/sections/governance";
import { Hero } from "@/components/sections/hero/hero";
import { MediaCentre } from "@/components/sections/media-centre/media-centre";
import { Shareholders } from "@/components/sections/shareholders";
import { UsefulLinks } from "@/components/sections/useful-links";
import { quickLinks } from "@/config/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, await getDictionary(locale), { path: "" });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <main id="main">
        <Hero locale={locale} dict={dict} />
        <About locale={locale} dict={dict} />
        <Shareholders locale={locale} dict={dict} />
        <Governance locale={locale} dict={dict} />
        <UsefulLinks dict={dict} />
        <MediaCentre locale={locale} dict={dict} />
      </main>

      <QuickLinks
        label={dict.a11y.sectionShortcuts}
        links={quickLinks.map((q) => ({ id: q.section, label: dict.quicklinks[q.key] }))}
      />
    </>
  );
}
