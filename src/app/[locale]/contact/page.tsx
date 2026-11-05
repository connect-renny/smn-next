import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InnerHero } from "@/components/layout/inner-hero";
import { ContactSection } from "@/components/sections/contact/contact-section";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "contact-details";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "contact",
    title: dict.labels.contact,
    description: `${dict.labels.contact} — ${dict.meta.siteName}`,
    // Stays out of search results (and the sitemap) until the design is approved.
    noIndex: true,
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main id="main">
      <InnerHero
        locale={locale}
        dict={dict}
        current={dict.labels.contact}
        titleLines={dict.contact.titleLines}
        nextSectionId={AFTER_HERO_ID}
      />
      <ContactSection dict={dict} locale={locale} id={AFTER_HERO_ID} />
    </main>
  );
}
