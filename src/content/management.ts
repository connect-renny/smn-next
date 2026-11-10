/**
 * Non-translatable Management page data. Names and bios live in the dictionaries.
 * Order follows the client's November 2026 update: Boris Smondack (CEO), then
 * Khalifa Al Kalbani (CFO).
 */
import type { Dictionary } from "@/i18n/get-dictionary";

import { leadershipExploreLinks } from "./governance-explore";

const IMAGES = "/images/management";

export type ManagementMemberId = keyof Dictionary["management"]["members"];

export const managementTeam: readonly { id: ManagementMemberId; photo: string }[] = [
  { id: "boris", photo: `${IMAGES}/boris-smondack.png` },
  { id: "khalifa", photo: `${IMAGES}/khalifa-al-kalbani.png` },
];

export const managementExploreLinks = leadershipExploreLinks("corporate-governance/management");
