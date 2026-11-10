/**
 * Non-translatable Nomination & Remuneration Committee page data. Members and order
 * follow smnpower.com/nomination.php. Bios are the Board page's, so the two never drift;
 * only the committee roles live in the nomination-committee dictionary.
 */
import type { Dictionary } from "@/i18n/get-dictionary";

import { leadershipExploreLinks } from "./governance-explore";

const IMAGES = "/images/board-of-directors";

export type NominationMemberId = keyof Dictionary["nominationCommittee"]["roles"];

export const nominationMembers: readonly { id: NominationMemberId; photo: string }[] = [
  { id: "mohammed", photo: `${IMAGES}/mohammed-al-husseini.png` },
  { id: "abdullah", photo: `${IMAGES}/abdullah-al-yahyaey.png` },
  { id: "david", photo: `${IMAGES}/david-beaufays.png` },
];

export const nominationExploreLinks = leadershipExploreLinks(
  "corporate-governance/nomination-remuneration-committee",
);
