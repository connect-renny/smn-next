import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
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

/**
 * Droid Arabic Kufi, the client's Arabic face (Regular only, file supplied by
 * them). It is limited to Arabic code points so Latin words and the Western
 * digits inside Arabic copy stay in Poppins, and it has no metric fallback —
 * that fallback would cover Latin too and win over Poppins. Only needed on
 * /ar, so it is not preloaded on English pages.
 */
const droidArabicKufi = localFont({
  src: "../../fonts/droid-arabic-kufi.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-arabic",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0600-06FF, U+0750-077F, U+0870-08FF, U+FB50-FDFF, U+FE70-FEFF, U+200C-200F",
    },
  ],
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
    const href = resolveHref(locale, assistTargets[id]);
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
    <html lang={htmlLang} dir={dir} className={`${poppins.variable} ${droidArabicKufi.variable}`}>
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
