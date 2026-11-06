import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { AnimatedSection } from "@/components/animations/animated-section";
import { CountUp } from "@/components/animations/count-up";
import { Droplet } from "@/components/ui/droplet";
import { shareholders } from "@/content/home";
import { shareholderChapters } from "@/content/main-shareholders";
import type { Dictionary } from "@/i18n/get-dictionary";

import { ChapterMotion } from "./shareholders-motion";

type ShareholderChapterProps = {
  chapter: (typeof shareholderChapters)[number];
  number: number;
  dict: Dictionary;
};

/** After the lead paragraph (and, for Mubadala, its context) comes the wall of figures. */
const paragraphsBeforeFigures = { kahrabel: 1, mubadala: 2 } as const;

export function ShareholderChapter({ chapter, number, dict }: ShareholderChapterProps) {
  const copy = dict.mainShareholders;
  const item = copy.items[chapter.id];
  const website = shareholders[chapter.id].website;
  const [lead, ...rest] = item.paragraphs;
  const split = paragraphsBeforeFigures[chapter.id] - 1;
  const [feature, ...stats] = item.stats;

  return (
    <AnimatedSection
      id={chapter.id}
      ink="light"
      snap={false}
      data-holder={chapter.id}
      className="holder"
      style={
        {
          "--accent": chapter.accent,
          "--accent-soft": chapter.accentSoft,
        } as React.CSSProperties
      }
    >
      <ChapterMotion className="holder-grid">
        <div className="holder-aside">
          <p dir="ltr" aria-hidden className="holder-number">
            {String(number).padStart(2, "0")}
          </p>
          <h2 className="holder-name">{item.name}</h2>

          <h3 className="holder-chain-label">{copy.ownershipLabel}</h3>
          <div data-chain className="holder-chain">
            <span data-chain-line aria-hidden className="holder-chain-line">
              <span data-chain-fill className="holder-chain-fill" />
            </span>
            <span data-chain-drop aria-hidden className="holder-chain-drop">
              <Droplet className="w-full fill-(--accent)" />
            </span>
            <ol className="holder-owners">
              {item.chain.map((owner) => (
                <li key={owner.name} data-chain-owner data-lit="" className="holder-owner">
                  {owner.link && <span className="holder-owner-link">{owner.link}</span>}
                  <span className="holder-owner-name">{owner.name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="min-w-0">
          <p data-animate="up" className="holder-lead">
            {lead}
          </p>
          {rest.slice(0, split).map((paragraph) => (
            <p key={paragraph} data-animate="up" className="holder-text">
              {paragraph}
            </p>
          ))}

          <dl className="holder-figures">
            <div data-animate="up" className="holder-figure holder-figure-feature">
              <div data-parallax aria-hidden className="absolute inset-0 overflow-hidden">
                <Image
                  src={chapter.image}
                  alt=""
                  fill
                  sizes="(min-width: 64rem) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <span aria-hidden className="holder-figure-scrim" />
              <dt className="holder-figure-label">{feature.label}</dt>
              <dd className="holder-figure-value">
                <span dir="ltr">
                  <CountUp value={feature.value} />
                </span>
                {feature.unit && <small>{feature.unit}</small>}
              </dd>
            </div>
            {stats.map((stat) => (
              <div key={stat.label} data-animate="up" className="holder-figure">
                <dt className="holder-figure-label">{stat.label}</dt>
                <dd className="holder-figure-value">
                  <span dir="auto">
                    <CountUp value={stat.value} />
                  </span>
                  {stat.unit && <small>{stat.unit}</small>}
                </dd>
              </div>
            ))}
          </dl>

          {rest.slice(split).map((paragraph) => (
            <p key={paragraph} data-animate="up" className="holder-text">
              {paragraph}
            </p>
          ))}

          {item.sectors.length > 0 && (
            <ul className="holder-sectors">
              {item.sectors.map((sector) => (
                <li key={sector} data-animate="up" className="holder-sector">
                  {sector}
                </li>
              ))}
            </ul>
          )}

          <div data-animate="up" className="holder-visit">
            <p>{item.visit}</p>
            <a href={website.href} target="_blank" rel="noopener noreferrer" dir="ltr">
              {website.label}
              <span className="sr-only"> {dict.a11y.opensInNewTab}</span>
              <ArrowUpRight aria-hidden className="size-[1.2em]" />
            </a>
          </div>
        </div>
      </ChapterMotion>
    </AnimatedSection>
  );
}
