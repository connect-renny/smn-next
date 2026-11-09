import Image from "next/image";

import { shareholderChapters } from "@/content/main-shareholders";
import type { Dictionary } from "@/i18n/get-dictionary";

import { ConfluenceMotion } from "./shareholders-motion";

/** Drawn from each logo (bottom) up to the SMN mark (top), so the flow still runs into SMN. */
const LINES = ["M100 176C100 64 200 114 200 4", "M300 176C300 64 200 114 200 4"] as const;

/** The page in one picture: SMN on top, branching down to its two shareholders. */
export function ShareholdersConfluence({
  copy,
  id,
}: {
  copy: Dictionary["mainShareholders"];
  id: string;
}) {
  return (
    <section id={id} data-ql-ink="dark" className="confluence">
      <ConfluenceMotion className="confluence-inner">
        <div data-confluence-mark className="confluence-mark">
          <Image src="/images/brand/smn-mark.svg" alt="" width={53} height={72} unoptimized />
          <p>{copy.companyName}</p>
        </div>

        <svg viewBox="0 0 400 176" aria-hidden className="confluence-lines">
          <defs>
            {shareholderChapters.map(({ id: chapter, accent, accentSoft }, i) => (
              <linearGradient
                key={chapter}
                id={`confluence-${chapter}`}
                gradientUnits="userSpaceOnUse"
                x1={i === 0 ? 100 : 300}
                y1="176"
                x2="200"
                y2="4"
              >
                <stop offset="0" stopColor={accent} />
                <stop offset="1" stopColor={accentSoft} />
              </linearGradient>
            ))}
          </defs>
          {shareholderChapters.map(({ id: chapter }, i) => (
            <g key={chapter}>
              <path
                data-confluence-line
                d={LINES[i]}
                pathLength={1}
                stroke={`url(#confluence-${chapter})`}
                className="confluence-line"
              />
              <path data-confluence-pulse d={LINES[i]} className="confluence-pulse" />
            </g>
          ))}
        </svg>

        <nav aria-label={copy.chaptersLabel} className="confluence-names">
          {shareholderChapters.map(({ id: chapter, accent, logo }) => (
            <a
              key={chapter}
              href={`#${chapter}`}
              className="confluence-name"
              style={{ "--accent": accent } as React.CSSProperties}
            >
              <Image
                src={logo.onLight}
                alt=""
                width={logo.width}
                height={logo.height}
                unoptimized
                className="confluence-logo"
              />
              <span className="sr-only">{copy.items[chapter].name}</span>
            </a>
          ))}
        </nav>
      </ConfluenceMotion>
    </section>
  );
}
