import type { Href, LabelKey } from "@/config/routes";

/** The four principles, in the order of smnpower.com/ethics.php. Wording is in the dictionaries. */
export const ethicsPrinciples = [
  { id: "compliance", colors: ["#2f74d0", "#6db3f5"] },
  { id: "integrity", colors: ["#39b24a", "#adcf37"] },
  { id: "fairness", colors: ["#f07f13", "#ffc06a"] },
  { id: "respect", colors: ["#14918b", "#63d8c0"] },
] as const;

export type EthicsPrincipleId = (typeof ethicsPrinciples)[number]["id"];

/** Same file for both languages, as on the live site. */
export const ethicsCharterHref =
  "https://www.smnpower.com/uploads/1629801217_ETHICS%20CHARTER%20%20Rules%20for%20Gifts%20and%20Hospitality%20Version%2003%20(Updated)%20Rev4.pdf";

export const ethicsExploreLinks: readonly { label: LabelKey; image: string; href: Href }[] = [
  {
    label: "companysPhilosophy",
    image: "/images/board-of-directors/explore-companys-philosophy.jpg",
    href: { page: "corporate-governance/companys-philosophy" },
  },
  {
    label: "boardOfDirectors",
    // The set's fourth tile: this page's own link is the one the Board page spends it on.
    image: "/images/board-of-directors/explore-ethics.jpg",
    href: { page: "corporate-governance/board-of-directors" },
  },
  {
    label: "auditCommittee",
    image: "/images/board-of-directors/explore-audit-committee.jpg",
    href: { page: "corporate-governance/audit-committee" },
  },
  {
    label: "nominationCommittee",
    image: "/images/board-of-directors/explore-nomination-committee.jpg",
    href: { page: "corporate-governance/nomination-remuneration-committee" },
  },
];
