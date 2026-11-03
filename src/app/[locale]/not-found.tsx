import Link from "next/link";

import { PageBanner } from "@/components/layout/page-banner";
import en from "@/i18n/dictionaries/en.json";

// not-found receives no params, so it renders in the default language.
export default function NotFound() {
  return (
    <main id="main">
      <PageBanner eyebrow="404" title={en.notFound.title}>
        <p className="mt-5 max-w-xl text-body leading-relaxed text-white/85">{en.notFound.text}</p>
        <Link
          href="/en"
          className="mt-10 inline-flex bg-orange px-7 py-3.5 text-sm font-semibold tracking-wider text-white uppercase transition-colors hover:bg-orange-dark"
        >
          {en.notFound.backHome}
        </Link>
      </PageBanner>
    </main>
  );
}
