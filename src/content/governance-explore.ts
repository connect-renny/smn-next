import type { Href, LabelKey, PageSlug } from "@/config/routes";

const IMAGES = "/images/board-of-directors";

/** The leadership pages that link to each other in their Explore Further row. */
const LEADERSHIP_PAGES = [
  { label: "boardOfDirectors", page: "corporate-governance/board-of-directors" },
  { label: "auditCommittee", page: "corporate-governance/audit-committee" },
  { label: "nominationCommittee", page: "corporate-governance/nomination-remuneration-committee" },
  { label: "management", page: "corporate-governance/management" },
] as const satisfies readonly { label: LabelKey; page: PageSlug }[];

export type LeadershipPage = (typeof LEADERSHIP_PAGES)[number]["page"];

/** The design's four tile artworks, used by position so every row looks the same. */
const TILE_ART = [
  `${IMAGES}/explore-companys-philosophy.jpg`,
  `${IMAGES}/explore-audit-committee.jpg`,
  `${IMAGES}/explore-nomination-committee.jpg`,
  `${IMAGES}/explore-ethics.jpg`,
];

/**
 * Explore Further for the Corporate Governance pages: Company's Philosophy first, then
 * three leadership pages, never the current one. Ethics, not one of them, gets the Board
 * and its two committees.
 */
export function leadershipExploreLinks(
  current: LeadershipPage | "corporate-governance/ethics",
): readonly { label: LabelKey; image: string; href: Href }[] {
  const targets = [
    { label: "companysPhilosophy", page: "corporate-governance/companys-philosophy" } as const,
    ...LEADERSHIP_PAGES.filter((p) => p.page !== current).slice(0, 3),
  ];
  return targets.map(({ label, page }, i) => ({ label, image: TILE_ART[i], href: { page } }));
}

/**
 * Company's Philosophy links to the bodies its text names: the Board, its two committees
 * and Ethics (the "highest ethical standards" component), as in the design.
 */
export const philosophyExploreLinks: readonly { label: LabelKey; image: string; href: Href }[] = [
  ...LEADERSHIP_PAGES.slice(0, 3),
  { label: "ethics", page: "corporate-governance/ethics" } as const,
].map(({ label, page }, i) => ({ label, image: TILE_ART[i], href: { page } }));
