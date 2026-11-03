import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Poppins } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

import { Assist } from "@/components/assist/assist";
import type { AssistEntry } from "@/components/assist/assist-search";
import { SmoothScrollProvider } from "@/components/animations/smooth-scroll-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header/header";
import { Preloader } from "@/components/layout/preloader";
import { ReturnTop } from "@/components/layout/return-top";
import { resolveHref } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { assistTargets } from "@/content/home";
import { isLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { metadataBase, pageMetadata } from "@/lib/metadata";
import { resolveNavigation } from "@/lib/nav";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Only needed on /ar, so it is not preloaded on English pages.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    metadataBase,
    applicationName: dict.meta.siteName,
    title: { default: dict.meta.title, template: `%s | ${dict.meta.siteName}` },
    formatDetection: { telephone: false },
    ...pageMetadata(locale, dict, { path: "" }),
  };
}

export const viewport: Viewport = {
  themeColor: "#12294f",
  width: "device-width",
  initialScale: 1,
};

function assistIndex(locale: Locale, index: Dictionary["assist"]["index"]): AssistEntry[] {
  return (Object.keys(assistTargets) as (keyof typeof assistTargets)[]).map((id) => {
    const entry = index[id];
    const href =
      id === "annualReport" && siteConfig.annualReport
        ? siteConfig.annualReport.href
        : resolveHref(locale, assistTargets[id]);
    return { id, title: entry.title, path: entry.path, keywords: entry.keywords, href };
  });
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const nav = resolveNavigation(locale, dict);
  const { dir, htmlLang } = localeMeta[locale];
  const { index, ...assistCopy } = dict.assist;

  return (
    <html lang={htmlLang} dir={dir} className={`${poppins.variable} ${plexArabic.variable}`}>
      <body>
        {/* Without JS the preloader would never lift. */}
        <noscript>
          <style>{"[data-preloader]{display:none!important}"}</style>
        </noscript>

        <SmoothScrollProvider>
          <Preloader alt={dict.meta.siteName} />

          <a
            href="#main"
            className="sr-only z-[10000] bg-orange px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
          >
            {dict.a11y.skipToContent}
          </a>

          <Header locale={locale} dict={dict} nav={nav} />
          {children}
          <Footer locale={locale} dict={dict} nav={nav} />

          <Assist
            copy={assistCopy}
            index={assistIndex(locale, index)}
            fallbackId="contact"
            speechLang={locale === "ar" ? "ar-OM" : "en-US"}
          />
          <ReturnTop label={dict.a11y.backToTop} />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
