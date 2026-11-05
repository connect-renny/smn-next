import { AnimatedSection } from "@/components/animations/animated-section";
import { CountUp } from "@/components/animations/count-up";
import { Droplet } from "@/components/ui/droplet";
import { dividends, dividendsByYear } from "@/content/dividends";
import type { Dictionary } from "@/i18n/get-dictionary";

import { DividendsMotion } from "./dividends-motion";

export function DividendsSection({ dict, id }: { dict: Dictionary; id: string }) {
  const t = dict.dividends;
  const latest = dividends[0];
  const highest = Math.max(...dividends.map((d) => Number.parseFloat(d.cash)));

  return (
    <AnimatedSection
      id={id}
      ink="dark"
      snap={false}
      className="scroll-mt-(--header-h) bg-white py-[clamp(48px,5.2vw,100px)] text-about-ink"
    >
      <DividendsMotion className="company-column grid items-start gap-[clamp(28px,3.2vw,62px)] lg:grid-cols-[minmax(280px,3fr)_8fr]">
        {/* The latest payment */}
        <div data-animate="up" className="dividend-latest text-white">
          <h2 className="flex items-center gap-eyebrow text-eyebrow-md font-semibold uppercase">
            <Droplet />
            {t.latest}
          </h2>

          <p className="mt-[clamp(28px,3.1vw,60px)] text-[clamp(52px,4.2vw,80px)] leading-none font-semibold tracking-[-0.04em]">
            <span dir="ltr" className="inline-flex">
              <CountUp value={latest.cash.replace("%", "")} />%
            </span>
          </p>
          <p className="mt-[0.6em] text-lead font-medium">
            {t.table.cash} · <span dir="ltr">{latest.year}</span>
          </p>

          <dl className="mt-[clamp(28px,3.1vw,60px)] grid gap-[clamp(14px,1vw,19px)] text-[clamp(13px,0.8vw,15.4px)]">
            {[
              [t.table.bonus, latest.bonus],
              [t.table.cutOff, latest.cutOff],
              [t.table.payment, latest.payment],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 border-t border-white/25 pt-[clamp(14px,1vw,19px)]"
              >
                <dt className="text-white/80">{label}</dt>
                <dd dir="ltr" className="font-semibold whitespace-nowrap tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The full history */}
        <table className="dividend-table">
          <caption className="sr-only">{dict.labels.dividendsDisclosures}</caption>
          <thead>
            <tr>
              <th scope="col">{t.table.year}</th>
              <th scope="col">{t.table.cash}</th>
              <th scope="col">{t.table.bonus}</th>
              <th scope="col">{t.table.cutOff}</th>
              <th scope="col">{t.table.payment}</th>
            </tr>
          </thead>
          {dividendsByYear().map(({ year, rows }) => (
            <tbody key={year} data-animate="up">
              {rows.map((row, i) => (
                <tr key={row.cutOff}>
                  {i === 0 && (
                    <th scope="rowgroup" rowSpan={rows.length} dir="ltr">
                      {year}
                    </th>
                  )}
                  <td data-label={t.table.cash} className="dividend-cash">
                    <span dir="ltr">{row.cash}</span>
                    <span aria-hidden className="dividend-track">
                      <span
                        data-dividend-bar
                        style={{ width: `${(Number.parseFloat(row.cash) / highest) * 100}%` }}
                      />
                    </span>
                  </td>
                  <td data-label={t.table.bonus} className="text-about-muted">
                    <span dir="ltr">{row.bonus}</span>
                  </td>
                  <td data-label={t.table.cutOff}>
                    <span dir="ltr">{row.cutOff}</span>
                  </td>
                  <td data-label={t.table.payment}>
                    <span dir="ltr">{row.payment}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </DividendsMotion>
    </AnimatedSection>
  );
}
