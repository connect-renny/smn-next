import Image from "next/image";

import { heroMedia, sectionVideos, usefulLinks } from "@/content/home";
import type { Dictionary } from "@/i18n/get-dictionary";
import { AnimatedSection } from "@/components/animations/animated-section";
import { BackgroundVideo } from "@/components/animations/background-video";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn, entries } from "@/lib/utils";

type UsefulLinksProps = { dict: Dictionary };

/** The comp spaces its two rows differently (4 logos, then 3). */
const links = entries(usefulLinks);
const rows = [
  { items: links.slice(0, 4), gap: "lg:gap-x-[5.68vw]", top: "mt-[clamp(46px,4.3vw,83px)]" },
  { items: links.slice(4), gap: "lg:gap-x-[7.71vw]", top: "mt-10 lg:mt-[clamp(52px,4.9vw,95px)]" },
];

export function UsefulLinks({ dict }: UsefulLinksProps) {
  const t = dict.links;

  return (
    <AnimatedSection
      id="links"
      ink="light"
      className="section-fit items-center justify-center bg-subs py-section-y text-white lg:pt-0 lg:pb-[8.8vh]"
    >
      <div className="absolute inset-0 z-0">
        <BackgroundVideo src={sectionVideos.links} poster={heroMedia.poster} />
      </div>

      <div className="relative z-1 w-full px-5 text-center">
        <Eyebrow data-animate="up" variant="hanging" className="text-eyebrow tracking-[0.05em]">
          {t.eyebrow}
        </Eyebrow>
        <h2
          data-animate="up"
          className="mt-[clamp(14px,1.2vw,23px)] text-section-title leading-[1.1] font-medium"
        >
          {t.title}
        </h2>

        {/* Hovering a mark dims the rest of the set, not the mark itself. */}
        <ul className="group/links">
          {rows.map((row, r) => (
            <li key={r} data-animate="up" className={row.top}>
              <ul
                className={cn(
                  "grid grid-cols-2 gap-x-6 gap-y-10 sm:flex sm:flex-wrap sm:items-start sm:justify-center sm:gap-x-12",
                  row.gap,
                )}
              >
                {row.items.map(([key, item]) => {
                  const name = t.items[key];
                  return (
                    <li key={key}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center text-white transition-opacity duration-300 group-has-[a:hover]/links:not-hover:opacity-30"
                      >
                        <span className="flex h-16 items-center justify-center lg:h-[4.95vw]">
                          <Image
                            src={item.logo}
                            alt={name}
                            width={item.width}
                            height={item.height}
                            className="h-auto max-h-full w-auto max-w-full lg:max-h-none lg:w-[calc(var(--logo-w)*100vw/1920)] lg:max-w-none"
                            style={{ "--logo-w": item.width } as React.CSSProperties}
                          />
                        </span>
                        <span className="mt-[clamp(14px,1.04vw,20px)] text-[clamp(11px,0.74vw,14.2px)]">
                          {item.label}
                          <span className="sr-only"> {dict.a11y.opensInNewTab}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
}
