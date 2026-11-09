import Image from "next/image";

import { AnimatedSection } from "@/components/animations/animated-section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { archivedReports, type ArchivedReport } from "@/content/annual-reports";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { newTab } from "@/lib/nav";

import { ReportBook } from "./report-book";
import { ReportWeave } from "./report-weave";

function GeneratedCover({ report, label }: { report: ArchivedReport; label: string }) {
  const [light, dark] = report.tones;
  return (
    <span
      className="report-cover-generated"
      style={{ background: `linear-gradient(165deg, ${light} 0%, ${dark} 72%)` }}
    >
      <Image src="/images/brand/smn-mark.svg" alt="" width={53} height={72} />
      <span className="report-cover-title">
        {label}
        <span dir="ltr" className="block font-bold">
          {report.year}
        </span>
      </span>
      <ReportWeave stroke="rgb(255 255 255 / 0.42)" className="report-cover-weave" />
    </span>
  );
}

/** Earlier years, standing on a shelf. Each turns to face the reader when picked out. */
export function ReportShelf({
  locale,
  dict,
  id,
  fallbackHref,
}: {
  locale: Locale;
  dict: Dictionary;
  id: string;
  /** Where a sample year (no PDF of its own yet) points: the latest report. */
  fallbackHref: string;
}) {
  const t = dict.annualReports;

  return (
    <AnimatedSection
      id={id}
      ink="dark"
      snap={false}
      className="scroll-mt-(--header-h) bg-page-tint py-[clamp(56px,5.6vw,108px)] text-about-ink"
    >
      <div className="company-column">
        <div data-animate="up">
          <Eyebrow className="text-eyebrow-md">
            <span dir="auto">{t.archiveEyebrow}</span>
          </Eyebrow>
        </div>
        <h2
          data-animate="up"
          className="mt-[clamp(18px,1.9vw,36px)] text-page-title leading-[1.2] font-medium tracking-[-0.05em] text-navy rtl:tracking-normal"
        >
          {t.archiveTitle}
        </h2>

        <ul className="report-shelf">
          {archivedReports.map((report) => {
            const href = report.href?.[locale] ?? fallbackHref;
            return (
              <li key={report.year} data-animate="up" className="report-shelf-item">
                <div className="report-shelf-card">
                  {/* The cover is a second way in; the View button is the one in the tab order. */}
                  <a
                    href={href}
                    {...newTab}
                    tabIndex={-1}
                    aria-hidden
                    className="report-shelf-stage"
                  >
                    <ReportBook year={report.year} spineTone={report.tones[1]}>
                      <GeneratedCover report={report} label={t.bookLabel} />
                    </ReportBook>
                  </a>
                  <span aria-hidden className="report-shelf-ledge" />
                  <span className="report-shelf-caption">
                    <span dir="ltr" className="report-shelf-year">
                      {report.year}
                    </span>
                    <a href={href} {...newTab} className="report-shelf-view">
                      {t.viewShort}
                      <span className="sr-only">
                        {" "}
                        {t.bookLabel} {report.year} {dict.a11y.opensInNewTab}
                      </span>
                    </a>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </AnimatedSection>
  );
}
