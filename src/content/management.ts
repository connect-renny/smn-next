/**
 * Non-translatable Management page data. Names and bios live in the dictionaries.
 * Order: Khalifa Al Kalbani (CFO), Abdullah Al Naimi (from the archived
 * smnpower.com/management.php, March 2026), then Anupam Kunwar (CTO).
 */
import type { Href, LabelKey } from "@/config/routes";
import type { Dictionary } from "@/i18n/get-dictionary";

const IMAGES = "/images/management";
const EXPLORE = "/images/board-of-directors";

export type ManagementMemberId = keyof Dictionary["management"]["members"];

export const managementTeam: readonly { id: ManagementMemberId; photo: string }[] = [
  { id: "khalifa", photo: `${IMAGES}/khalifa-al-kalbani.png` },
  { id: "naimi", photo: `${IMAGES}/abdullah-al-naimi.png` },
  { id: "anupam", photo: `${IMAGES}/anupam-kunwar.png` },
];

export const managementExploreLinks: readonly { label: LabelKey; image: string; href: Href }[] = [
  {
    label: "boardOfDirectors",
    image: `${EXPLORE}/explore-ethics.jpg`,
    href: { page: "corporate-governance/board-of-directors" },
  },
  {
    label: "companysPhilosophy",
    image: `${EXPLORE}/explore-companys-philosophy.jpg`,
    href: { page: "corporate-governance/companys-philosophy" },
  },
  {
    label: "auditCommittee",
    image: `${EXPLORE}/explore-audit-committee.jpg`,
    href: { page: "corporate-governance/audit-committee" },
  },
  {
    label: "nominationCommittee",
    image: `${EXPLORE}/explore-nomination-committee.jpg`,
    href: { page: "corporate-governance/nomination-remuneration-committee" },
  },
];
