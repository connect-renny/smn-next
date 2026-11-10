import Image from "next/image";
import Link from "next/link";

import type { NewsItem } from "@/lib/news";

/** The arrow in the white notch, as on the home page's news cards. */
export function NewsArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 14"
      aria-hidden
      className={`h-auto fill-none stroke-current stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round] rtl:-scale-x-100 ${className ?? ""}`}
    >
      <path d="M1 7h21M16 1l6 6-6 6" />
    </svg>
  );
}

/**
 * A news card in the home page's style: the photo with a white step notched out of
 * its corner holding an arrow, then the title and date. The photo eases in and the
 * arrow runs ahead on hover.
 */
export function NewsCard({ item, href }: { item: NewsItem; href: string }) {
  return (
    <Link href={href} className="news-card group block text-inherit">
      <figure className="relative m-0 aspect-[418/303] overflow-hidden rounded-[clamp(12px,1.1vw,20px)] bg-page-tint">
        <Image
          src={item.cover.src}
          alt=""
          fill
          sizes="(min-width: 1280px) 26vw, (min-width: 768px) 45vw, 100vw"
          className="news-card-img object-cover"
        />
        <span className="absolute start-0 bottom-0 flex h-[27.4%] w-[33.97%] items-center justify-end bg-white pe-[7.18%] text-media-arrow">
          <NewsArrow className="news-card-arrow w-[clamp(16px,1.15vw,22px)]" />
        </span>
      </figure>
      {item.dateLabel && (
        <p className="mt-[clamp(16px,1.4vw,26px)] text-[13px] font-medium tracking-[0.04em] text-orange uppercase rtl:tracking-normal">
          {item.dateLabel}
        </p>
      )}
      <h3
        className={`${item.dateLabel ? "mt-2" : "mt-[clamp(16px,1.4vw,26px)]"} line-clamp-3 text-[18px] leading-[1.45] font-semibold text-navy transition-colors duration-300 group-hover:text-orange-dark`}
      >
        <span dir="auto">{item.title}</span>
      </h3>
    </Link>
  );
}
