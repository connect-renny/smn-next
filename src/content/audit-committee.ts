/**
 * Non-translatable Audit Committee page data. Members and order follow
 * smnpower.com/audit-committee.php. Bios are the Board page's, so the two never drift;
 * only the committee roles live in the audit-committee dictionary.
 */
import type { Dictionary } from "@/i18n/get-dictionary";

import { leadershipExploreLinks } from "./governance-explore";

const IMAGES = "/images/board-of-directors";

export type AuditMemberId = keyof Dictionary["auditCommittee"]["roles"];

export const auditMembers: readonly { id: AuditMemberId; photo: string }[] = [
  { id: "imran", photo: `${IMAGES}/imran-sheikh.png` },
  { id: "ruben", photo: `${IMAGES}/ruben-ramalho.png` },
  { id: "nujayma", photo: `${IMAGES}/nujayma-al-maqbali.png` },
];

export const auditExploreLinks = leadershipExploreLinks("corporate-governance/audit-committee");
