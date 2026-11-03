"use client";

import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type MediaCard = { title: string; date: string; image: string; href: string };

type MediaCarouselProps = {
  heading: React.ReactNode;
  label: string;
  cards: MediaCard[];
  labels: { previous: string; next: string };
  dir: "ltr" | "rtl";
};

function Arrow({ kind, label }: { kind: "prev" | "next"; label: string }) {
  const { scrollPrev, scrollNext } = useCarousel();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={kind === "prev" ? scrollPrev : scrollNext}
      className={cn(
        "grid size-11 place-items-center border border-transparent text-about-ink transition-colors hover:border-orange hover:text-orange lg:size-[clamp(44px,3.23vw,62px)]",
        kind === "next" && "border-media-rule",
      )}
    >
      <svg
        viewBox="0 0 12 20"
        aria-hidden
        className="h-auto w-[clamp(9px,0.63vw,12px)] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] rtl:-scale-x-100"
      >
        <path d={kind === "prev" ? "M10 1 2 10l8 9" : "M2 1l8 9-8 9"} />
      </svg>
    </button>
  );
}

/**
 * Looping, autoplaying news slider (3 / 2 / 1 per view), paused on hover and
 * for reduced-motion visitors. Built on the shadcn/ui Carousel (Embla).
 */
export function MediaCarousel({ heading, label, cards, labels, dir }: MediaCarouselProps) {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: false }),
  );

  // Autoplay starts once Embla is ready, and never for reduced-motion visitors.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => autoplay.play(), 0);
    return () => {
      window.clearTimeout(timer);
      autoplay.stop();
    };
  }, [autoplay]);

  return (
    <Carousel
      opts={{ loop: true, align: "start", direction: dir, duration: 30 }}
      plugins={[autoplay]}
      dir={dir}
      aria-label={label}
    >
      <div className="flex items-start justify-between gap-8">
        {heading}
        <div
          data-animate="up"
          className="mt-[clamp(18px,1.98vw,38px)] flex shrink-0 gap-[clamp(6px,0.52vw,10px)]"
        >
          <Arrow kind="prev" label={labels.previous} />
          <Arrow kind="next" label={labels.next} />
        </div>
      </div>

      <div data-animate="up" className="mt-[clamp(28px,2.55vw,49px)]">
        <CarouselContent className="-ms-5 md:-ms-[26px] xl:-ms-[1.77vw]">
          {cards.map((card, i) => (
            <CarouselItem
              key={`${card.href}-${i}`}
              className="basis-full ps-5 md:basis-1/2 md:ps-[26px] xl:basis-1/3 xl:ps-[1.77vw]"
            >
              <Link href={card.href} className="group block text-inherit">
                <figure className="relative m-0 aspect-[418/303] overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(min-width: 1280px) 23vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* White step notched out of the photo's corner. */}
                  <span className="absolute start-0 bottom-0 flex h-[27.4%] w-[33.97%] items-center justify-end bg-white pe-[7.18%]">
                    <svg
                      viewBox="0 0 24 14"
                      aria-hidden
                      className="h-auto w-[clamp(16px,1.15vw,22px)] fill-none stroke-media-arrow stroke-[1.6] transition-transform duration-300 [stroke-linecap:round] [stroke-linejoin:round] group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                    >
                      <path d="M1 7h21M16 1l6 6-6 6" />
                    </svg>
                  </span>
                </figure>
                <h3 className="mt-[clamp(18px,1.77vw,34px)] line-clamp-2 ps-[clamp(12px,1.09vw,21px)] pe-2 text-card-title leading-[1.42] font-semibold">
                  {card.title}
                </h3>
                {card.date && (
                  <p className="mt-[clamp(11px,0.99vw,19px)] px-[clamp(13px,1.2vw,23px)] text-[clamp(11px,0.67vw,12.9px)]">
                    {card.date}
                  </p>
                )}
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
}
