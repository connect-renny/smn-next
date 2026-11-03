import Image from "next/image";
import Link from "next/link";

import { resolveHref } from "@/config/routes";
import { activeSocialLinks, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { ResolvedNavigation } from "@/lib/nav";
import { BrandIcon } from "@/components/ui/brand-icons";

type FooterProps = { locale: Locale; dict: Dictionary; nav: ResolvedNavigation };

const label =
  "mb-5 text-footer-sm font-medium tracking-[-0.02em] text-footer-muted uppercase lg:mb-[clamp(20px,2.08vw,40px)]";
const text = "text-footer leading-normal font-medium tracking-[-0.03em] not-italic";
const linkHover = "transition-colors hover:text-orange";
const tallCell =
  "px-5 py-10 sm:px-6 sm:py-12 lg:min-h-[clamp(360px,25.6vw,492px)] lg:px-cell lg:pt-[clamp(48px,6.67vw,128px)] lg:pb-10";
const bandCell = "flex items-center px-5 py-6 sm:px-6 lg:px-cell lg:py-0";
const bandText = "text-footer-sm leading-[1.7] font-medium tracking-[-0.03em] uppercase";

export function Footer({ locale, dict, nav }: FooterProps) {
  const f = dict.footer;
  const social = activeSocialLinks();
  const report = siteConfig.annualReport;

  return (
    <footer id="contact" data-snap="" className="relative overflow-hidden bg-footer-bg text-white">
      {/* Brand droplets, placed as in the 1920 comp (512×700 → 26.67vw wide).
          Start edge: the artwork as-is, its lower rings peeking in from above.
          End edge: the same shape as a mask over a top-down green → navy fade. */}
      <Image
        src="/images/brand/footer-droplet.png"
        alt=""
        aria-hidden
        width={512}
        height={700}
        className="pointer-events-none absolute -start-[11.35vw] -top-[27.81vw] w-[26.67vw] max-w-none select-none rtl:-scale-x-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -end-[15.73vw] -top-[0.83vw] aspect-[512/700] w-[26.67vw] bg-linear-to-b from-report to-footer-bg [mask:url(/images/brand/footer-droplet.png)_center/100%_100%_no-repeat] rtl:-scale-x-100"
      />

      <div className="footer-grid relative lg:shell">
        {/* Office */}
        <div data-area="office" className={tallCell}>
          <h2 className={label}>{f.office}</h2>
          <address className={text}>
            {f.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          {social.length > 0 && (
            <ul
              aria-label={dict.a11y.social}
              className="mt-[clamp(24px,2.5vw,48px)] flex gap-[clamp(8px,0.73vw,14px)]"
            >
              {social.map(([network, href]) => (
                <li key={network}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${network} ${dict.a11y.opensInNewTab}`}
                    className="grid size-8 place-items-center text-white transition-colors hover:bg-black hover:text-orange"
                  >
                    <BrandIcon network={network} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contact */}
        <div data-area="contact" className={tallCell}>
          <h2 className={label}>{f.contact}</h2>
          <p className={`${text} mb-[clamp(16px,1.25vw,24px)] leading-[1.875]`}>
            <a href={siteConfig.contact.phone.href} className={linkHover}>
              {f.phonePrefix} <span dir="ltr">{siteConfig.contact.phone.display}</span>
            </a>
            <br />
            <span>
              {f.faxPrefix} <span dir="ltr">{siteConfig.contact.fax.display}</span>
            </span>
          </p>
          <h2 className={label}>{f.email}</h2>
          <p className={text}>
            <a href={`mailto:${siteConfig.contact.email}`} className={linkHover}>
              {siteConfig.contact.email}
            </a>
          </p>
        </div>

        {/* About links */}
        <nav data-area="about" aria-label={f.aboutUs} className={tallCell}>
          <h2 className={label}>{f.aboutUs}</h2>
          <ul className="flex flex-col gap-[clamp(14px,1.67vw,32px)] ps-1">
            {nav.footerAbout.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-footer leading-none font-semibold tracking-[-0.03em] uppercase ${linkHover}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Annual report card */}
        <div data-area="report">
          <a
            href={report?.href ?? resolveHref(locale, { page: "investors/annual-report" })}
            {...(report ? { download: "" } : {})}
            className="group flex h-full min-h-70 flex-col items-center justify-center bg-report text-center text-white transition-colors hover:bg-report-dark lg:h-[clamp(280px,18.23vw,350px)] lg:min-h-0 lg:justify-start lg:pt-[clamp(40px,4.06vw,78px)]"
          >
            <Image
              src="/images/footer/annual-report.png"
              alt=""
              width={162}
              height={162}
              className="mb-[clamp(18px,1.82vw,35px)] h-auto w-[clamp(110px,7.8vw,150px)] transition-transform group-hover:-translate-y-1.5"
            />
            <span className="text-footer-sm leading-[1.9] font-semibold uppercase">
              {f.downloadAnnualReport}
            </span>
            {report && (
              <span className="text-footer-sm leading-[1.9] font-semibold uppercase">
                {report.meta}
              </span>
            )}
          </a>
        </div>

        {/* Bottom band */}
        <div data-area="credit" className={bandCell}>
          <p className={bandText}>
            {f.creditLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            {siteConfig.creditUrl ? (
              <a
                href={siteConfig.creditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-muted transition-colors hover:text-orange"
              >
                {f.credit}
              </a>
            ) : (
              <span className="text-footer-muted">{f.credit}</span>
            )}
          </p>
        </div>

        <div data-area="blank" aria-hidden />

        <div data-area="copy" className={bandCell}>
          <p className={`${bandText} ps-1`}>
            <span dir="ltr">{f.copyright}</span>
          </p>
        </div>

        <div data-area="lock" className={`${bandCell} sm:justify-end lg:justify-center`}>
          <Image
            src="/images/footer/site-lock.png"
            alt={f.siteLockAlt}
            width={115}
            height={68}
            className="h-auto w-[clamp(96px,6vw,115px)]"
          />
        </div>
      </div>
    </footer>
  );
}
