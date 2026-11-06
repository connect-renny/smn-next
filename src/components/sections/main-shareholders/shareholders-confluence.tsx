import Image from "next/image";

import { shareholderChapters } from "@/content/main-shareholders";
import type { Dictionary } from "@/i18n/get-dictionary";

import { ConfluenceMotion } from "./shareholders-motion";

const LINES = ["M100 0C100 112 200 62 200 172", "M300 0C300 112 200 62 200 172"] as const;

/** The page in one picture: two shareholders, flowing into one company. */
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
        <nav aria-label={copy.chaptersLabel} className="confluence-names">
          {shareholderChapters.map(({ id: chapter, accent }, i) => (
            <a
              key={chapter}
              href={`#${chapter}`}
              className="confluence-name"
              style={{ "--accent": accent } as React.CSSProperties}
            >
              <span dir="ltr" aria-hidden className="confluence-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              {copy.items[chapter].name}
            </a>
          ))}
        </nav>

        <svg viewBox="0 0 400 176" aria-hidden className="confluence-lines">
          <defs>
            {shareholderChapters.map(({ id: chapter, accent, accentSoft }, i) => (
              <linearGradient
                key={chapter}
                id={`confluence-${chapter}`}
                gradientUnits="userSpaceOnUse"
                x1={i === 0 ? 100 : 300}
                y1="0"
                x2="200"
                y2="172"
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

        <div data-confluence-mark className="confluence-mark">
          <Image src="/images/brand/smn-mark.svg" alt="" width={53} height={72} unoptimized />
          <p>{copy.companyName}</p>
        </div>
      </ConfluenceMotion>
    </section>
  );
}
