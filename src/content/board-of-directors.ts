/**
 * Non-translatable Board of Directors page data. Names and bios live in the
 * dictionaries; the order below is the design's.
 */
import type { Href } from "@/config/routes";
import type { Dictionary } from "@/i18n/get-dictionary";

const IMAGES = "/images/board-of-directors";

export type BoardMemberId = keyof Dictionary["boardOfDirectors"]["members"];

export const boardMembers: readonly { id: BoardMemberId; photo: string }[] = [
  { id: "abdullah", photo: `${IMAGES}/abdullah-al-yahyaey.png` },
  { id: "david", photo: `${IMAGES}/david-beaufays.png` },
  { id: "mohammed", photo: `${IMAGES}/mohammed-al-husseini.png` },
  { id: "imran", photo: `${IMAGES}/imran-sheikh.png` },
  { id: "boris", photo: `${IMAGES}/boris-smondack.png` },
  { id: "ruben", photo: `${IMAGES}/ruben-ramalho.png` },
  { id: "nujayma", photo: `${IMAGES}/nujayma-al-maqbali.png` },
  // No photos supplied for these two yet.
  { id: "mahinder", photo: `${IMAGES}/member-placeholder.png` },
  { id: "zoher", photo: `${IMAGES}/member-placeholder.png` },
];

export const boardExploreLinks: readonly {
  label: keyof Dictionary["labels"];
  image: string;
  href: Href;
}[] = [
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
