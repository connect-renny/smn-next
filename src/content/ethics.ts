import { leadershipExploreLinks } from "./governance-explore";

/** The four principles, in the order of smnpower.com/ethics.php. Wording is in the dictionaries. */
export const ethicsPrinciples = [
  { id: "compliance", colors: ["#2f74d0", "#6db3f5"] },
  { id: "integrity", colors: ["#39b24a", "#adcf37"] },
  { id: "fairness", colors: ["#f07f13", "#ffc06a"] },
  { id: "respect", colors: ["#14918b", "#63d8c0"] },
] as const;

export type EthicsPrincipleId = (typeof ethicsPrinciples)[number]["id"];

/** Same file for both languages, as on the live site. */
export const ethicsCharterHref =
  "https://www.smnpower.com/uploads/1629801217_ETHICS%20CHARTER%20%20Rules%20for%20Gifts%20and%20Hospitality%20Version%2003%20(Updated)%20Rev4.pdf";

export const ethicsExploreLinks = leadershipExploreLinks("corporate-governance/ethics");
