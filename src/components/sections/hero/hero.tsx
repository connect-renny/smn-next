import Image from "next/image";
import Link from "next/link";

import { resolveHref } from "@/config/routes";
import { heroMedia, heroTabs } from "@/content/home";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Lines } from "@/components/ui/lines";

import { HeroIntro } from "./hero-intro";
import { HeroMedia } from "./hero-media";
import { HeroPlayButton } from "./hero-play-button";

type HeroProps = { locale: Locale; dict: Dictionary };

export function Hero({ locale, dict }: HeroProps) {
  const t = dict.hero;

  return (
    <section
      id="home"
      data-snap=""
      data-ql-ink="light"
      className="section-fit h-svh min-h-[560px] bg-navy-deep text-white"
    >
      <HeroMedia video={heroMedia.video} poster={heroMedia.poster} />
      <span aria-hidden className="hero-scrim pointer-events-none absolute inset-0 z-1" />

      <HeroIntro className="relative z-2 flex min-h-0 flex-1 flex-col">
        {/* Headline */}
        <div className="flex min-h-0 flex-1 items-center justify-center pt-(--header-h) pb-8 lg:pb-[clamp(30px,17vh,180px)]">
          <div className="px-5 text-center">
            <h1 className="text-hero leading-[0.92] font-light tracking-[-0.015em] text-shadow-[0_2px_34px_rgb(6_18_38/0.5)] max-lg:leading-[1.02]">
              {t.titleLines.map((line, i) => (
                // Extra bottom room (pulled back with a negative margin) so descenders
                // like "g" aren't clipped by the reveal mask; line spacing is unchanged.
                <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.2em]">
                  <span data-hero-line className="block">
                    <Lines lines={[line]} />
                  </span>
                </span>
              ))}
            </h1>
            <HeroPlayButton label={t.playVideo} />
          </div>
        </div>

        {/* Scroll cue */}
        <a
          href="#about"
          aria-label={dict.a11y.scrollDown}
          className="scroll-cue max-lg:hidden"
          data-hero-fade
        >
          <span className="scroll-cue-track">
            <Image src="/images/home/hero-arrow.png" alt="" width={10} height={37} />
          </span>
        </a>

        {/* Bottom shortcut tabs */}
        <div className="pb-6 lg:pb-[clamp(24px,9.8vh,100px)]">
          <div className="site-container">
            <div className="grid gap-2 lg:grid-cols-3 lg:gap-[clamp(24px,5vw,92px)] lg:px-[clamp(0px,2.8vw,52px)]">
              {heroTabs.map((tab, index) => {
                const copy = t.tabs[tab.key];
                return (
                  <Link
                    key={tab.key}
                    href={resolveHref(locale, tab.href)}
                    className="hero-tab"
                    data-hero-fade
                  >
                    <span className="hero-tab-panel">
                      <span className="relative shrink-0 text-center">
                        <span className="absolute start-0 top-0 text-label tracking-[0.06em] opacity-90">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="inline-block text-label font-bold tracking-[0.02em] whitespace-nowrap uppercase">
                          {copy.title}
                        </span>
                      </span>

                      <span className="hero-tab-detail">
                        {"text" in copy ? (
                          <span className="mt-[clamp(18px,3.5vh,36px)] max-w-[66%] text-center text-[clamp(10px,0.66vw,12.7px)] leading-[1.57]">
                            {copy.text}
                          </span>
                        ) : (
                          <span
                            role="list"
                            className="mt-[clamp(16px,3.1vh,32px)] flex w-[88%] flex-col gap-[clamp(10px,1.7vh,18px)] text-center"
                          >
                            {copy.items.map((news) => (
                              <span
                                key={news.title}
                                role="listitem"
                                className="flex flex-col gap-[3px]"
                              >
                                <span className="line-clamp-2 text-[clamp(10px,0.66vw,12.7px)] leading-[1.45] font-medium">
                                  {news.title}
                                </span>
                                {news.date && (
                                  <span className="text-[clamp(9px,0.54vw,10.4px)] tracking-[0.04em] opacity-82">
                                    {news.date}
                                  </span>
                                )}
                              </span>
                            ))}
                          </span>
                        )}
                        <span className="mt-[clamp(16px,3.2vh,34px)] border-b border-white/90 pb-[3px] text-micro leading-[1.2] font-semibold tracking-[0.05em] uppercase">
                          {t.explore}
                        </span>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </HeroIntro>
    </section>
  );
}
