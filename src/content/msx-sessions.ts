/**
 * The recorded MSX discussion sessions, newest first, as listed on
 * smnpower.com/msx-discussion.php. Titles live in the dictionaries. `seconds` was
 * read from each video, as the live page doesn't show running times.
 */
import type { Dictionary } from "@/i18n/get-dictionary";

export type MsxSessionId = keyof Dictionary["msxSessions"]["sessions"];
export type MsxPeriod = keyof Dictionary["msxSessions"]["periods"];

export type MsxSession = {
  id: MsxSessionId;
  year: string;
  period: MsxPeriod;
  seconds: number;
  /** A Vimeo id plays in Vimeo's player; a file plays in the browser's own. */
  video: { vimeo: string; href: string } | { file: string };
};

const UPLOADS = "https://www.smnpower.com/uploads";

export const msxSessions: readonly MsxSession[] = [
  {
    id: "h1-2026",
    year: "2026",
    period: "h1",
    seconds: 1241,
    video: { vimeo: "1221427888", href: "https://vimeo.com/1221427888" },
  },
  {
    id: "fy-2025",
    year: "2025",
    period: "fullYear",
    seconds: 1791,
    video: { vimeo: "1174291598", href: "https://vimeo.com/1174291598" },
  },
  {
    id: "h1-2025",
    year: "2025",
    period: "h1",
    seconds: 2828,
    video: { vimeo: "1110867757", href: "https://vimeo.com/1110867757" },
  },
  {
    id: "fy-2024",
    year: "2024",
    period: "fullYear",
    seconds: 3746,
    video: { vimeo: "1067305142", href: "https://vimeo.com/1067305142" },
  },
  {
    id: "h1-2024",
    year: "2024",
    period: "h1",
    seconds: 2747,
    video: { file: `${UPLOADS}/Discussion-Session-June-2024.mp4` },
  },
  {
    id: "fy-2023",
    year: "2023",
    period: "fullYear",
    seconds: 3897,
    video: { file: `${UPLOADS}/Session-Financial2023-2024.mp4` },
  },
  {
    id: "h1-2023",
    year: "2023",
    period: "h1",
    seconds: 3994,
    video: { file: `${UPLOADS}/msx-june2023.mp4` },
  },
  {
    id: "fy-2022",
    year: "2022",
    period: "fullYear",
    seconds: 1743,
    video: { file: `${UPLOADS}/MSX_Meeting-H2-2023.mp4` },
  },
  {
    id: "h1-2022",
    year: "2022",
    period: "h1",
    seconds: 2743,
    video: { file: `${UPLOADS}/MSX-Meeting.mp4` },
  },
];

/** The sessions of each year, newest year first, in their Full Year and H1 slots. */
export function msxSessionsByYear(items: readonly MsxSession[] = msxSessions) {
  const years = [...new Set(items.map((s) => s.year))];
  return years.map((year) => ({
    year,
    fullYear: items.find((s) => s.year === year && s.period === "fullYear"),
    h1: items.find((s) => s.year === year && s.period === "h1"),
  }));
}

/** Running time as a clock reading: 20:41, or 1:02:26 past the hour. */
export function formatRunningTime(total: number) {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}

export function vimeoEmbedUrl(id: string) {
  return `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0&color=f79431`;
}
