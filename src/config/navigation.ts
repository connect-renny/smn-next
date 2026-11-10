import type { Href, LabelKey } from "./routes";

export type NavLink = { label: LabelKey; href: Href };
/** A group without `href` is a plain label that only opens its menu. */
export type NavGroup = { label: LabelKey; href?: Href; children?: NavLink[] };

/** SMN's page on the Muscat Stock Exchange, which carries these three investor items. */
const MSX_SNAPSHOT: Href = { external: "https://www.msx.om/snapshot.aspx?s=SMNP" };

/** Top utility bar (above the main nav). Language switch is rendered separately. */
export const utilityNav: NavLink[] = [
  { label: "career", href: { page: "career" } },
  { label: "media", href: { page: "media" } },
  { label: "contact", href: { page: "contact" } },
];

/** Main navigation — same order, groups and labels as the approved demo. */
export const mainNav: NavGroup[] = [
  {
    label: "aboutUs",
    children: [
      { label: "ourCompany", href: { page: "about/our-company" } },
      { label: "visionMission", href: { page: "about/vision-mission" } },
      { label: "mainShareholders", href: { page: "about/main-shareholders" } },
    ],
  },
  {
    label: "governance",
    href: { section: "governance" },
    children: [
      { label: "companysPhilosophy", href: { page: "corporate-governance/companys-philosophy" } },
      { label: "boardOfDirectors", href: { page: "corporate-governance/board-of-directors" } },
      { label: "auditCommittee", href: { page: "corporate-governance/audit-committee" } },
      {
        label: "nominationCommittee",
        href: { page: "corporate-governance/nomination-remuneration-committee" },
      },
      { label: "management", href: { page: "corporate-governance/management" } },
      { label: "ethics", href: { page: "corporate-governance/ethics" } },
    ],
  },
  {
    label: "investors",
    href: { page: "investors" },
    children: [
      { label: "disclosures", href: MSX_SNAPSHOT },
      { label: "financialReports", href: MSX_SNAPSHOT },
      { label: "dividendsDisclosures", href: { page: "investors/dividends-disclosures" } },
      { label: "annualReport", href: { page: "investors/annual-report" } },
      { label: "sharePrice", href: MSX_SNAPSHOT },
      { label: "msxDiscussion", href: { page: "investors/msx-discussion-session" } },
    ],
  },
  { label: "csr", href: { page: "csr" } },
  { label: "tenders", href: { page: "tenders" } },
];

/** Footer "About Us" column. */
export const footerAboutLinks: NavLink[] = [
  { label: "ourCompany", href: { page: "about/our-company" } },
  { label: "visionMission", href: { page: "about/vision-mission" } },
  { label: "mainShareholders", href: { page: "about/main-shareholders" } },
  { label: "barkaPlant", href: { page: "plants/barka-ii" } },
  { label: "rusailPlant", href: { page: "plants/al-rusail" } },
];

/** Fixed rail of section shortcuts (desktop). */
export const quickLinks = [
  { key: "about", section: "about" },
  { key: "shareholders", section: "shareholders" },
  { key: "governance", section: "governance" },
  { key: "links", section: "links" },
  { key: "media", section: "media" },
] as const;
