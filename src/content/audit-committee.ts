/**
 * Non-translatable Audit Committee page data. Members and order follow
 * smnpower.com/audit-committee.php. Bios are the Board page's, so the two never drift;
 * only the committee roles live in the audit-committee dictionary.
 */
import type { Href, LabelKey } from "@/config/routes";
import type { Dictionary } from "@/i18n/get-dictionary";

const IMAGES = "/images/board-of-directors";

export type AuditMemberId = keyof Dictionary["auditCommittee"]["roles"];

export const auditMembers: readonly { id: AuditMemberId; photo: string }[] = [
  { id: "imran", photo: `${IMAGES}/imran-sheikh.png` },
  { id: "ruben", photo: `${IMAGES}/ruben-ramalho.png` },
  { id: "nujayma", photo: `${IMAGES}/nujayma-al-maqbali.png` },
];

export const auditExploreLinks: readonly { label: LabelKey; image: string; href: Href }[] = [
  {
    label: "boardOfDirectors",
    image: `${IMAGES}/explore-audit-committee.jpg`,
    href: { page: "corporate-governance/board-of-directors" },
  },
  {
    label: "companysPhilosophy",
    image: `${IMAGES}/explore-companys-philosophy.jpg`,
    href: { page: "corporate-governance/companys-philosophy" },
  },
  {
    label: "nominationCommittee",
    image: `${IMAGES}/explore-nomination-committee.jpg`,
    href: { page: "corporate-governance/nomination-remuneration-committee" },
  },
  {
    label: "ethics",
    image: `${IMAGES}/explore-ethics.jpg`,
    href: { page: "corporate-governance/ethics" },
  },
];
