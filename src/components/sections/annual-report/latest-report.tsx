"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { newTab } from "@/lib/nav";

import { ReportBook } from "./report-book";

type LatestReportProps = {
  id: string;
  year: string;
  cover: string;
  href: string;
  meta?: string;
  otherHref?: string;
  pages: number;
  opensInNewTab: string;
  copy: {
    latestEyebrow: string;
    bookLabel: string;
    tagline: string[];
    pages: string;
    view: string;
    otherEdition: string;
  };
};

/** The newest report as a book you can nearly pick up: it leans toward the cursor. */
export function LatestReport({
  id,
  year,
  cover,
  href,
  meta,
  otherHref,
  pages,
  opensInNewTab,
  copy,
}: LatestReportProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope);
        const sign = document.documentElement.dir === "rtl" ? -1 : 1;
        const numeral = q("[data-numeral]");

        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: scope.current, start: "top 72%", once: true },
          })
          .from(numeral, { autoAlpha: 0, duration: 1.4 }, 0)
          .from(
            q("[data-book]"),
            {
              autoAlpha: 0,
              y: 70,
              rotationY: sign * 60,
              transformPerspective: 1400,
              duration: 1.5,
              clearProps: "all",
            },
            0.1,
          )
          .from(
            q("[data-reveal]"),
            { autoAlpha: 0, y: 28, duration: 0.9, stagger: 0.08, clearProps: "all" },
            0.4,
          );

        // The giant year slides against the scroll, so the book seems to sit in front of it.
        gsap.fromTo(
          numeral,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope },
  );

  /** Feeds the lean in CSS: -1…1 across the stage. */
  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    el.style.setProperty("--mx", String(((event.clientX - box.left) / box.width) * 2 - 1));
    el.style.setProperty("--my", String(((event.clientY - box.top) / box.height) * 2 - 1));
  };

  const onPointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--mx", "0");
    event.currentTarget.style.setProperty("--my", "0");
  };

  return (
    <section
      ref={scope}
      id={id}
      data-ql-ink="light"
      className="report-latest scroll-mt-(--header-h)"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span aria-hidden dir="ltr" data-numeral className="report-latest-numeral">
        {year}
      </span>

      <div className="company-column report-latest-grid">
        <div data-book className="report-latest-book">
          <a
            href={href}
            {...newTab}
            aria-label={`${copy.bookLabel} ${year} ${opensInNewTab}`}
            className="report-book-link"
          >
            <span className="report-book-float">
              <ReportBook year={year}>
                <Image
                  src={cover}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 64rem) 420px, 60vw"
                  className="object-cover"
                />
              </ReportBook>
            </span>
          </a>
          <span aria-hidden className="report-book-shadow" />
        </div>

        <div className="relative text-white">
          <div data-reveal>
            <Eyebrow className="text-eyebrow-md">
              <span dir="auto">{copy.latestEyebrow}</span>
            </Eyebrow>
          </div>
          <h2
            data-reveal
            className="mt-[clamp(18px,1.6vw,30px)] text-[clamp(38px,4.4vw,84px)] leading-[1.02] font-medium tracking-[-0.04em] rtl:leading-[1.2] rtl:tracking-normal"
          >
            {copy.bookLabel}{" "}
            <span dir="ltr" className="block font-bold text-orange rtl:text-right">
              {year}
            </span>
          </h2>
          <p
            data-reveal
            className="mt-[clamp(16px,1.5vw,28px)] text-[clamp(18px,1.45vw,27px)] leading-[1.35] font-light"
          >
            {copy.tagline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <ul data-reveal className="report-latest-meta">
            <li>
              <span dir="ltr">{pages}</span> {copy.pages}
            </li>
            {meta && <li dir="ltr">{meta}</li>}
          </ul>

          <div data-reveal className="report-latest-actions">
            <a href={href} {...newTab} className="report-latest-cta group">
              <span>{copy.view}</span>
              <span className="sr-only"> {opensInNewTab}</span>
              <ArrowUpRight
                aria-hidden
                className="size-[1.2em] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </a>
            {otherHref && (
              <a href={otherHref} {...newTab} className="report-latest-other">
                {copy.otherEdition}
                <span className="sr-only"> {opensInNewTab}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
