import Image from "next/image";
import Link from "next/link";

import { resolveHref } from "@/config/routes";
import { shareholders, shareholdersMoreHref } from "@/content/home";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { AnimatedSection } from "@/components/animations/animated-section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Lines } from "@/components/ui/lines";
import { cn, entries } from "@/lib/utils";

type ShareholdersProps = { locale: Locale; dict: Dictionary };

/** The comp's two panels differ in indent, text measure and link gap. */
const variants: Record<keyof typeof shareholders, { content: string; text: string; link: string }> =
  {
    kahrabel: {
      content: "lg:ps-[15.73vw]",
      text: "lg:max-w-[24vw]",
      link: "mt-[clamp(26px,2.94vw,57px)]",
    },
    mubadala: {
      content: "lg:ps-[7.76vw]",
      text: "lg:max-w-[26.8vw]",
      link: "mt-[clamp(8px,0.73vw,14px)]",
    },
  };

export function Shareholders({ locale, dict }: ShareholdersProps) {
  const t = dict.shareholders;

  return (
    <AnimatedSection id="shareholders" ink="light" className="shareholders section-fit lg:flex-row">
      {entries(shareholders).map(([key, holder]) => {
        const copy = t.items[key];
        const v = variants[key];
        return (
          <article
            key={key}
            className="sh-panel relative flex min-h-[85svh] min-w-0 overflow-hidden text-white lg:min-h-0"
          >
            <div data-animate="clip" data-parallax className="absolute inset-0 overflow-hidden">
              <Image
                src={holder.image}
                alt={copy.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <span
              aria-hidden
              className="sh-scrim pointer-events-none absolute inset-0 z-1 bg-linear-to-b from-[rgb(105_116_126/0.14)] via-[rgb(86_97_112/0.21)] via-32% to-[rgb(66_76_90/0.42)] max-lg:to-[rgb(30_38_50/0.7)]"
            />

            <div
              className={cn(
                "relative z-2 flex h-full w-full flex-col items-start px-5 pt-28 pb-14 sm:px-10 lg:pe-[4vw] lg:pt-[23.8vh] lg:pb-[20.5vh]",
                v.content,
              )}
            >
              <Eyebrow data-animate="up" className="text-eyebrow-md tracking-[0.06em]">
                {t.eyebrow}
              </Eyebrow>
              <h2
                data-animate="up"
                className="mt-[clamp(20px,1.76vw,34px)] text-sh-title leading-[1.045] font-medium tracking-[-0.01em]"
              >
                <Lines lines={copy.titleLines} breakFrom="always" />
              </h2>
              <p
                data-animate="up"
                className={cn("mt-[clamp(15px,1.19vw,23px)] max-w-xl text-body", v.text)}
              >
                {copy.text}
              </p>
              <a
                data-animate="up"
                href={holder.website.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "border-b border-white/85 pb-[5px] text-[clamp(12px,0.776vw,14.9px)] font-medium text-white transition-colors hover:border-orange hover:text-orange",
                  v.link,
                )}
              >
                {holder.website.label}
                <span className="sr-only"> {dict.a11y.opensInNewTab}</span>
              </a>
              <div data-animate="up" className="mt-auto max-lg:pt-10">
                <Link
                  href={resolveHref(locale, shareholdersMoreHref)}
                  aria-label={copy.moreLabel}
                  className="btn-plus"
                />
              </div>
            </div>
          </article>
        );
      })}
    </AnimatedSection>
  );
}
