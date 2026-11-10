/**
 * News for the Media pages and the home page carousel, newest first. Each item is
 * what a CMS entry will hold: a slug, a date, a card photo, an optional larger
 * photo for the article, and the title and text in both languages. When the CMS
 * arrives, `src/lib/news.ts` reads from it instead of this file; the pages stay as
 * they are.
 *
 * Text is from smnpower.com/media.php and its articles. Only the OPAL article has
 * its full text so far; the others show their title and photo until they get theirs.
 */
import type { Locale } from "@/i18n/config";

export type NewsImage = { src: string; width: number; height: number };

export type NewsEntry = {
  slug: string;
  /** ISO date (YYYY-MM-DD), or null where the live site gives none. */
  date: string | null;
  /** The photo on cards. */
  cover: NewsImage;
  /** The photo at the top of the article; the cover when there is none. */
  image?: NewsImage;
  title: Record<Locale, string>;
  /** Paragraphs of the article, in each language. */
  body: Record<Locale, readonly string[]>;
};

export const newsEntries: readonly NewsEntry[] = [
  {
    slug: "opal-mou",
    date: "2022-08-31",
    cover: { src: "/images/home/news-opal-mou.jpg", width: 367, height: 250 },
    image: { src: "/images/media/opal-mou-signing.jpg", width: 1000, height: 431 },
    title: {
      en: "Signed a Memorandum of Understanding with OPAL to Sponsor Number of Social Responsibilities Initiatives",
      ar: "توقيع مذكرة تفاهم مع أوبال لرعاية عدد من مبادرات المسؤولية الاجتماعية",
    },
    body: {
      en: [
        "Wednesday, 31st of August 2022, SMN Power Holding SAOG signed a Memorandum of Understanding with Oman Society for Petroleum Services to sponsor number of social responsibilities initiatives as part of SMN Power Holding SAOG strong commitment to Corporate Social Responsibility.",
        "This Memorandum of Understanding is a pursuant of both party’s commitment to support in funding the most relevant social responsibility projects, that enhance the welfare of the Omani community, citizens and environment.",
      ],
      ar: [
        "وقعت شركة اس ام ان باورالقابضة ش.م.ع.ع مذكرة تفاهم مع الجمعية العمانية للخدمات النفطية يوم الأربعاء 31 أغسطس 2022 لتمويل ودعم عدد من مبادرات المسؤولية الاجتماعية.",
        "تأتي هذه الاتفاقية تأكيدا لأهمية المسؤولية الاجتماعية والتزاما من الطرفين بدعم المشاريع التي تعزز رفاهية المجتمع والمواطن والبيئة العمانية.",
      ],
    },
  },
  {
    slug: "csr-solar-power-initiative",
    date: null,
    cover: { src: "/images/home/news-solar-school.jpg", width: 367, height: 250 },
    title: {
      en: "CSR Solar Power Initiative",
      ar: "التربية توقع اتفاقية مع مجموعة من الشركات لتجهيز إحدى المدارس بنظام الطاقة الشمسية",
    },
    body: { en: [], ar: [] },
  },
  {
    slug: "oer-top-20",
    date: null,
    cover: { src: "/images/home/news-oer-top20.jpg", width: 367, height: 250 },
    title: {
      en: "SMN Power ranks 17th in the OER Top 20 for 2016",
      ar: "شركة إس إم إن باور القابضة تحصل على المركز سابع عشر بين عشرين ضمن أفضل شركات OER لعام 2016",
    },
    body: { en: [], ar: [] },
  },
];
