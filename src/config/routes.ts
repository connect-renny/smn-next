import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

/** Home-page section anchors (the approved one-pager). */
export const sectionIds = [
  "home",
  "about",
  "shareholders",
  "governance",
  "links",
  "media",
  "contact",
] as const;
export type SectionId = (typeof sectionIds)[number];

export type LabelKey = keyof Dictionary["labels"];

/**
 * Inner pages that the demo's navigation points at but which have no content
 * yet. Each renders a branded "Coming soon" page; `related` adds a link back to
 * the home section that already covers the topic.
 */
export const innerPages = {
  "about/vision-mission": { label: "visionMission", related: "about" },
  "about/main-shareholders": { label: "mainShareholders", related: "shareholders" },
  "plants/barka-ii": { label: "barkaPlant", related: "about" },
  "plants/al-rusail": { label: "rusailPlant", related: "about" },
  "corporate-governance/companys-philosophy": {
    label: "companysPhilosophy",
    related: "governance",
  },
  "corporate-governance/audit-committee": { label: "auditCommittee", related: "governance" },
  "corporate-governance/nomination-remuneration-committee": {
    label: "nominationCommittee",
    related: "governance",
  },
  "corporate-governance/management": { label: "management", related: "governance" },
  "corporate-governance/articles-of-association": {
    label: "articlesOfAssociation",
    related: "governance",
  },
  "corporate-governance/ethics": { label: "ethics", related: "governance" },
  investors: { label: "investors", related: null },
  "investors/disclosures": { label: "disclosures", related: null },
  "investors/financial-reports": { label: "financialReports", related: null },
  "investors/annual-report": { label: "annualReport", related: null },
  "investors/share-price": { label: "sharePrice", related: null },
  csr: { label: "csr", related: null },
  career: { label: "career", related: null },
  "media/opal-mou": { label: "newsOpalMou", related: "media" },
  "media/csr-solar-power-initiative": { label: "newsCsrSolar", related: "media" },
  "media/oer-top-20": { label: "newsOerTop20", related: "media" },
} as const satisfies Record<string, { label: LabelKey; related: SectionId | null }>;

type PlaceholderSlug = keyof typeof innerPages;

/** Pages with real content: each has its own route folder under `app/[locale]`. */
export const contentPages = [
  "about/our-company",
  "corporate-governance/board-of-directors",
  "investors/dividends-disclosures",
  "investors/msx-discussion-session",
  "tenders",
] as const;

export type PageSlug = PlaceholderSlug | (typeof contentPages)[number];

/** Downloads configured per language in `siteConfig` (see `resolveHref`). */
export type DocumentId = "annualReport";

export type Href =
  { section: SectionId } | { page: PageSlug } | { external: string } | { document: DocumentId };

export function isPageSlug(value: string): value is PlaceholderSlug {
  return Object.hasOwn(innerPages, value);
}

/** Turns a typed destination into a locale-aware URL. */
export function resolveHref(locale: Locale, href: Href): string {
  if ("external" in href) return href.external;
  if ("document" in href) {
    return siteConfig.annualReport?.[locale].href ?? `/${locale}/investors/annual-report`;
  }
  if ("page" in href) return `/${locale}/${href.page}`;
  return href.section === "home" ? `/${locale}` : `/${locale}#${href.section}`;
}
