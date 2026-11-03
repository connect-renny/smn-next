import type { Href, LabelKey } from "./routes";

export type NavLink = { label: LabelKey; href: Href };
export type NavGroup = NavLink & { children?: NavLink[] };

/** Top utility bar (above the main nav). Language switch is rendered separately. */
export const utilityNav: NavLink[] = [
  { label: "career", href: { page: "career" } },
  { label: "media", href: { section: "media" } },
  { label: "contact", href: { section: "contact" } },
];

/** Main navigation — same order, groups and labels as the approved demo. */
export const mainNav: NavGroup[] = [
  {
    label: "aboutUs",
    href: { section: "about" },
    children: [
      { label: "ourCompany", href: { page: "about/our-company" } },
      { label: "visionMission", href: { page: "about/vision-mission" } },
      { label: "mainShareholders", href: { section: "shareholders" } },
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
      {
        label: "articlesOfAssociation",
        href: { page: "corporate-governance/articles-of-association" },
      },
      { label: "ethics", href: { page: "corporate-governance/ethics" } },
    ],
  },
  {
    label: "investors",
    href: { page: "investors" },
    children: [
      { label: "disclosures", href: { page: "investors/disclosures" } },
      { label: "financialReports", href: { page: "investors/financial-reports" } },
      { label: "dividendsDisclosures", href: { page: "investors/dividends-disclosures" } },
      { label: "annualReport", href: { page: "investors/annual-report" } },
      { label: "sharePrice", href: { page: "investors/share-price" } },
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
  { label: "mainShareholders", href: { section: "shareholders" } },
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
