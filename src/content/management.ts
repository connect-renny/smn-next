/**
 * Non-translatable Management page data. Names and bios live in the dictionaries.
 * Order: Khalifa Al Kalbani (CFO), Abdullah Al Naimi (from the archived
 * smnpower.com/management.php, March 2026), then Anupam Kunwar (CTO).
 */
import type { Dictionary } from "@/i18n/get-dictionary";

import { leadershipExploreLinks } from "./governance-explore";

const IMAGES = "/images/management";

export type ManagementMemberId = keyof Dictionary["management"]["members"];

export const managementTeam: readonly { id: ManagementMemberId; photo: string }[] = [
  { id: "khalifa", photo: `${IMAGES}/khalifa-al-kalbani.png` },
  { id: "naimi", photo: `${IMAGES}/abdullah-al-naimi.png` },
  { id: "anupam", photo: `${IMAGES}/anupam-kunwar.png` },
];

export const managementExploreLinks = leadershipExploreLinks("corporate-governance/management");
