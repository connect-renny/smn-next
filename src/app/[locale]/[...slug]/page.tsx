import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { PageBanner } from "@/components/layout/page-banner";
import { innerPages, isPageSlug, resolveHref, type SectionId } from "@/config/routes";
import { isLocale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/metadata";

// Every real slug is prerendered via generateStaticParams; unknown slugs must
// 404 (not soft-404 inside a Suspense stream), so this segment may block.
export const instant = false;

export function generateStaticParams() {
  return Object.keys(innerPages).map((path) => ({ slug: path.split("/") }));
}

function sectionLabel(dict: Dictionary, section: SectionId) {
  const labels: Partial<Record<SectionId, string>> = {
    about: dict.labels.aboutUs,
    shareholders: dict.labels.mainShareholders,
    governance: dict.labels.governance,
    links: dict.links.title,
    media: dict.labels.mediaCentre,
  };
  return labels[section] ?? dict.a11y.home;
}

async function load(params: PageProps<"/[locale]/[...slug]">["params"]) {
  const { locale, slug } = await params;
  const path = slug.join("/");
  if (!isLocale(locale) || !isPageSlug(path)) return null;
  return { locale, path, page: innerPages[path], dict: await getDictionary(locale) };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[...slug]">): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const { locale, path, page, dict } = data;
  return pageMetadata(locale, dict, {
    path,
    title: dict.labels[page.label],
    description: `${dict.labels[page.label]} — ${dict.meta.siteName}`,
    // Placeholder pages stay out of search results until they have content.
    noIndex: true,
  });
}

export default async function InnerPage({ params }: PageProps<"/[locale]/[...slug]">) {
  const data = await load(params);
  if (!data) notFound();
  const { locale, page, dict } = data;

  return (
    <main id="main">
      <PageBanner eyebrow={dict.comingSoon.eyebrow} title={dict.labels[page.label]}>
        <p className="mt-5 max-w-xl text-body text-white/85">{dict.comingSoon.text}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          {page.related && (
            <Link
              href={resolveHref(locale, { section: page.related })}
              className="inline-flex items-center gap-3 bg-orange px-7 py-3.5 text-sm font-semibold tracking-wider text-white uppercase transition-colors hover:bg-orange-dark"
            >
              {dict.comingSoon.related} {sectionLabel(dict, page.related)}
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </Link>
          )}
          <Link
            href={resolveHref(locale, { section: "home" })}
            className="inline-flex items-center gap-3 border border-white/60 px-7 py-3.5 text-sm font-semibold tracking-wider text-white uppercase transition-colors hover:border-orange hover:text-orange"
          >
            <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden />
            {dict.comingSoon.backHome}
          </Link>
        </div>
      </PageBanner>
    </main>
  );
}
