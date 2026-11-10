/**
 * Non-translatable Board of Directors page data. Names and bios live in the
 * dictionaries; members, photos and order follow smnpower.com/board-of-directors.php.
 */
import type { Dictionary } from "@/i18n/get-dictionary";

import { leadershipExploreLinks } from "./governance-explore";

const IMAGES = "/images/board-of-directors";

export type BoardMemberId = keyof Dictionary["boardOfDirectors"]["members"];

export const boardMembers: readonly { id: BoardMemberId; photo: string }[] = [
  { id: "abdullah", photo: `${IMAGES}/abdullah-al-yahyaey.png` },
  { id: "david", photo: `${IMAGES}/david-beaufays.png` },
  { id: "imran", photo: `${IMAGES}/imran-sheikh.png` },
  { id: "mohammed", photo: `${IMAGES}/mohammed-al-husseini.png` },
  { id: "mahinder", photo: `${IMAGES}/mahinder-nath.png` },
  { id: "ruben", photo: `${IMAGES}/ruben-ramalho.png` },
  { id: "nujayma", photo: `${IMAGES}/nujayma-al-maqbali.png` },
  { id: "zoher", photo: `${IMAGES}/zoher-karachiwala.png` },
];

export const boardExploreLinks = leadershipExploreLinks("corporate-governance/board-of-directors");
