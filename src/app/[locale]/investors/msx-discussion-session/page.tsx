import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnimatedSection } from "@/components/animations/animated-section";
import { InnerHero } from "@/components/layout/inner-hero";
import { MsxTheatre } from "@/components/sections/msx-sessions/msx-theatre";
import { resolveHref } from "@/config/routes";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

const AFTER_HERO_ID = "sessions";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/investors/msx-discussion-session">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata(locale, dict, {
    path: "investors/msx-discussion-session",
    title: dict.labels.msxDiscussion,
    description: dict.msxSessions.text,
    // Stays out of search results (and the sitemap) until there is an approved design.
    noIndex: true,
  });
}

export default async function MsxDiscussionSessionPage({
  params,
}: PageProps<"/[locale]/investors/msx-discussion-session">) {
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
        current={dict.labels.msxDiscussion}
        titleLines={dict.msxSessions.titleLines}
        text={dict.msxSessions.text}
        nextSectionId={AFTER_HERO_ID}
      />
      <AnimatedSection id={AFTER_HERO_ID} ink="light" snap={false} className="msx-theatre">
        <MsxTheatre copy={dict.msxSessions} />
      </AnimatedSection>
    </main>
  );
}
