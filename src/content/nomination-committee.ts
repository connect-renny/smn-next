/**
 * Non-translatable Nomination & Remuneration Committee page data. Members and order
 * follow smnpower.com/nomination.php. Bios are the Board page's, so the two never drift;
 * only the committee roles live in the nomination-committee dictionary.
 */
import type { Href, LabelKey } from "@/config/routes";
import type { Dictionary } from "@/i18n/get-dictionary";

const IMAGES = "/images/board-of-directors";

export type NominationMemberId = keyof Dictionary["nominationCommittee"]["roles"];

export const nominationMembers: readonly { id: NominationMemberId; photo: string }[] = [
  { id: "mohammed", photo: `${IMAGES}/mohammed-al-husseini.png` },
  { id: "abdullah", photo: `${IMAGES}/abdullah-al-yahyaey.png` },
  { id: "david", photo: `${IMAGES}/david-beaufays.png` },
];

export const nominationExploreLinks: readonly { label: LabelKey; image: string; href: Href }[] = [
  {
    label: "boardOfDirectors",
    // This page's own tile image, spent on the Board link as the Audit page does.
    image: `${IMAGES}/explore-nomination-committee.jpg`,
    href: { page: "corporate-governance/board-of-directors" },
  },
  {
    label: "companysPhilosophy",
    image: `${IMAGES}/explore-companys-philosophy.jpg`,
    href: { page: "corporate-governance/companys-philosophy" },
  },
  {
    label: "auditCommittee",
    image: `${IMAGES}/explore-audit-committee.jpg`,
    href: { page: "corporate-governance/audit-committee" },
  },
  {
    label: "ethics",
    image: `${IMAGES}/explore-ethics.jpg`,
    href: { page: "corporate-governance/ethics" },
  },
];
